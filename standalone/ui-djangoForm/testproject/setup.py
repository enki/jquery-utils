#!/usr/bin/python
# -*- coding: utf-8 -*-

from optparse import OptionParser
from glob import glob
import os
import shutil
import sys
import commands

LOG = True
SVNREV = ''

LOGS = {
    'list':         ' - %s',
    'build':        '\n [\x1b\x5b1;31mB\x1b\x5b0;0m] %s',
    'dependency':   ' [\x1b\x5b01;34mD\x1b\x5b0;0m]  - %s',
    'minify':       '\n [\x1b\x5b01;33mM\x1b\x5b0;0m] %s',
    'zip':          '\n [\x1b\x5b01;32mZ\x1b\x5b0;0m] %s',
    'gzip':         '\n [\x1b\x5b01;32mG\x1b\x5b0;0m] %s',
    'merge':        '\n [\x1b\x5b1;36mM\x1b\x5b0;0m] %s',
    'copy':         '\n [\x1b\x5b1;36mC\x1b\x5b0;0m] %s',
    'link':         '\n [\x1b\x5b1;36mC\x1b\x5b0;0m] %s',
    'error':        'Error: %s',
}

def log(msg, log_type=False):
    if LOG:
        print LOGS.get(log_type, '%s') % msg

def legend():
    for k in LOGS:
        if k not in ('list', 'error'):
            print LOGS[k] % k

def create_dir_if_not_exists(path):
    if not os.path.exists(path):
        log("creating directory: %s/" % path, 'list')
        os.mkdir(path)
    return path

if __name__ == '__main__':
    usage = "usage: %prog [options] <module>"
    parser = OptionParser(usage=usage)
    parser.add_option('-q', '--quiet', dest='quiet',
                      help='Not console output',
                      action='store_true', default=False)
    (options, args) = parser.parse_args()

    if options.legend:
        legend()
    else:
        DEST = 'testproject/media/js/ui-djangoForm/'
        CMD  = '%s -> %s' % ('src/', DEST)
        create_dir_if_not_exists(DEST)
        log(CMD, 'link')
        try:
            print commands.getoutput(CMD)
        except (IOError, OSError):
            log('Error %s to %s' % (src, dest), 'error')

        print '\n Done.\n'
