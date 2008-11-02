#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
    Experimental build system
"""

import os, yaml
from optparse import OptionParser

BUILD_DIR = 'build/'
LOG = True
JAR = "java -jar %s" % os.path.join(BUILD_DIR, 'js.jar')
SVNREV = ''

def log(i, type=False):
    global LOG
    if LOG or type in ['error', 'debug']:
        if type == 0:
            print i
        elif type == 'build':
            print '\n [\x1b\x5b1;31mB\x1b\x5b0;0m] %s' % i
        elif type == 'list':
            print ' - %s' % i
        elif type == 'dependency':
            print '  - [\x1b\x5b01;34mD\x1b\x5b0;0m] %s' % i
        elif type == 'minify':
            print '  - [\x1b\x5b01;33mM\x1b\x5b0;0m] %s' % i
        elif type == 'merge':
            print '\n [\x1b\x5b1;36mM\x1b\x5b0;0m] %s' % i
        elif type == 'error':
            print 'Error: %s' % i
        else:
            print i

def get_svn_rev(path=''):
    """
    Probably not the most reliable way to get
    the SVN revision of the cwd, but it works..
    """
    global SVNREV
    if not SVNREV:
        rs = os.popen('svn info %s' % path)
        o  = rs.readlines()
    return o[4][10:-1]

def get_builds():
    out    = []
    rs     = os.popen("find . -iname 'build.yml'");
    builds = rs.readlines()

    rs.close()
    for build in builds:
        f  = build[2:].replace("\n", '')
        rs = file(f, 'r')
        try:
            buff = yaml.load(rs)
        except yaml.YAMLError, exc:
            log("YAML - cannot read file: %s" % f, 'error')

        rs.close()
        out.append([f, buff])
    return out

def minify(src, dest):
    global JAR
    global BUILD_DIR
    log('%s -> %s' % (src, dest), 'minify')
    rs = os.popen('%s %s %s %s' % (JAR, 
        os.path.join(BUILD_DIR, 'build/min.js'),
        src, dest))
    buff = rs.readlines()
    rs.close()
    if len(buff) > 0:
        log(''.join(buff), 'error')
        return False
    else:
        return True


def glob(f):
    """
    Returns file content as string
    """
    rs = file(f, 'r')
    buff = rs.readlines()
    rs.close()
    return ''.join(buff)

def get_dependencies(obj, path=''):
    """
    Returns a string containing dependencies
    """
    o = []
    for dependency in obj:
        p = os.path.join(path, dependency['src'])
        log(p, 'dependency')
        o.append(glob(p))
    return ''.join(o)

def get_dest_filename(module):
    if module.has_key('destfile'):
        fn = module['destfile']
    elif module['file']:
        fn = os.path.basename(module['file'])
    return fn

def get_dest_dir(base, build):
    dest = os.path.join(base, build['dest'])
    if not os.path.isdir(dest):
        log("creating destination directory: %s" % dest, 'list')
        os.mkdir(dest)
    return dest

def make(build, options):
    global LOG

    o     = []
    file  = build[0]
    build = build[1]
    base  = os.path.dirname(file)
    dest  = get_dest_dir(base, build)

    if options.quiet:
        LOG = False

    if build.has_key('svnrev'):
        version = 'v%s (r%s)' % (build['version'], get_svn_rev())
    else:
        version = 'v%s' % build['version']

    if build.has_key('merge'):
        for merge in build['merge']:
            dest = os.path.join(base, merge['dest'])
            log(dest, 'merge')

            f = open(dest, 'w+')
            o = get_dependencies(merge['files'], base)
            f.write(o)
            f.close()


    if build['modules']:
        o = []
        for module in build['modules']:
            destPath    = os.path.join(base, build['dest'], get_dest_filename(module))

            if module.has_key('title'):
                title = module['title']
            else:
                title = build['title']

            log("%s %s -> %s" % (title, version, destPath), 'build')
            o.append(get_dependencies(module['depends'], base))
            o.append(glob(os.path.join(base, module['file'])))

            f = open(destPath, 'w+')
            buff = ''.join(o)

            if build.has_key('version'):
                buff = buff.replace('@VERSION', '%s' % build['version'])

            f.write(buff)
            f.close()

            if options.minify:
                minify(destPath, destPath.replace('.js', '.min.js'))

if __name__ == '__main__':
    usage = "usage: %prog [options] <module>"
    builds = get_builds()

    parser = OptionParser(usage=usage)

    parser.add_option('-o', '--modules', dest='modules',
                      help='Build only specified modules',
                      action='store_true', default=False)
    parser.add_option('-m', '--minify', dest='minify',
                      help='Build only specified modules',
                      action='store_true', default=False)
    parser.add_option('-q', '--quiet', dest='quiet',
                      help='Not console output',
                      action='store_true', default=False)
    
    (options, args) = parser.parse_args()

    for build in builds:
        make(build, options)

    print '\n Done.\n'
