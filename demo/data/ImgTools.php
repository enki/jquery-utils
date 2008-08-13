<?php

define('_ImgTools_src_', './');       // Source
define('_ImgTools_dst_', './cache/'); // Destination

class ImgTools {
    private $src     = '';
    private $dst     = '';
    private $type    = '';
    private $srcimg  = false;
    private $dstimg  = false;
    private $cached  = true;
    private $methods = array('scale', 'crop', 'text');     // order matters
    private $allowed = array('jpg', 'jpeg', 'png', 'gif'); // allowed image types

    public function __construct($cached=true) {
        if ($_REQUEST['img'] && file_exists($_REQUEST['img'])) {
            $this->src    = $_REQUEST['img'];
            $this->dst    = sprintf('%s%s', _ImgTools_dst_, $this->hash());
            $this->type   = $this->imgType();
            $this->cached = $cached;

            if (!in_array($this->type, $this->allowed)) {
                die('Error: unsupported file type.');
            }
            $this->serve();
        }
    }

    public function __destruct() {
        if ($this->srcimg) { imagedestroy($this->srcimg); }
        if ($this->dstimg) { imagedestroy($this->dstimg); }
    }

    private function imgType() {
        return substr(strrchr($this->src, '.'), 1);
    }

    private function hash() {
        $seed = array();
        foreach ($this->methods as $method) {
            if ($_REQUEST[$method]) {
                array_push($seed, sprintf('%s-%s', $method, $_REQUEST[$method]));
            }
        }
        return sprintf('%s_%s', join(',', $seed), $_REQUEST['img']);
    }

    private function serve() {
        switch ($this->type) {
            case 'jpg':
            case 'jpeg': header('Content-type: image/jpg'); break;
            case 'gif':  header('Content-type: image/gif'); break;
            case 'png':  header('Content-type: image/png'); break;
        }

        die(readfile($this->cache())); // TODO: try redirect instead
    }

    private function imgCreate() {
        list($w, $h, $type, $attr) = getimagesize($this->src); 
        $this->dstimg = imagecreatetruecolor($w, $h);
        switch ($this->type) {
            case 'jpg':
            case 'jpeg':
                $this->srcimg = imagecreatefromjpeg($this->src);
            break;
            case 'png':
                $this->srcimg = imagecreatefrompng($this->src);
            break;
            case 'gif':
                $this->srcimg = imagecreatefromgif($this->src);
            break;
        }
    }

    private function imgApplyMethods() {
        $applied = 0;
        foreach ($this->methods as $method) {
            if ($_REQUEST[$method] && method_exists($this, $method)) {
                call_user_method($method, $this, $_REQUEST[$method]);
                $applied++;
            }
        }
        return $applied;
    }

    private function save() {
        $cache = ($this->cached) ? $this->dst : false;
        switch ($this->type) {
            case 'jpg':
            case 'jpeg':
                $img = imagejpeg($this->dstimg, $cache);
            break;
            case 'png':
                $img = imagepng($this->dstimg, $cache);
            break;
            case 'gif':
                $img = imagegif($this->dstimg, $cache);
            break;
        }
    }

    private function cache() {
//      if (file_exists($this->dst)) {
//          return $this->dst;
//      }
//      else { // create cache
            $this->imgCreate();
            if ($this->imgApplyMethods() == 0) { // unchanged
                return $this->src;
            }
            else {
                $this->save();
                return $this->dst;
            }
//      }
    }


    private function scale($percent) {
        list($w, $h) = getimagesize($this->src);
        $nw = (int)$percent / 100 * $w;
        $nh = (int)$percent / 100 * $h;

        $this->dstimg = imagecreatetruecolor($nw, $nh);
        imagecopyresampled($this->dstimg, $this->srcimg, 0, 0, 0, 0, $nw, $nh, $w, $h);
        $this->srcimg = $this->dstimg; // apply incrementally
    }

    // options: t,l,w,h
    private function crop($options) { 
        list($w, $h) = getimagesize($this->src);
        list($nx, $ny, $nw, $nh) = split(',', $options);

        $this->dstimg = imagecreatetruecolor($nw, $nh);
        imagecopy($this->dstimg, $this->srcimg, $nx, $ny, 0, 0, $w, $h);
        $this->srcimg = $this->dstimg; // apply incrementally
    }

    // options: font,x,y,r,g,b,Text
    private function text($options) {
        list($w, $h) = getimagesize($this->src);
        list($font, $x, $y, $r, $g, $b, $text) = split(',', $options);
        $this->dstimg = imagecreatetruecolor($w, $h);
        imagecopy($this->dstimg, $this->srcimg, 0, 0, 0, 0, $w, $h);
        imagestring($this->dstimg, $font, $x, $y,  $text, imagecolorallocate($this->dstimg, $r, $g, $b));
    }

}

new ImgTools();
/*

imgToolsBackend.php?img=data/banksy-01.jpg&scale=50&crop=0,0,100,100
 */
?>
