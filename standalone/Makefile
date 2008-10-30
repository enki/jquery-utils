SRC_DIR   = ../src
BUILD_DIR = ../build
PREFIX    = .
DIST_DIR  = ${PREFIX}/dist

UI_TIMEPICKR_FILES = ${SRC_DIR}/jquery.utils.js\
    ${SRC_DIR}/jquery.strings.js\
    ${SRC_DIR}/ui.dropslide.js\
    ${SRC_DIR}/ui.timepickr.js\
    #${SRC_DIR}/jquery.i18n.js\
 	#${SRC_DIR}/ui.masked.js\
    #${SRC_DIR}/jquery.mousewheel.js\
    #${SRC_DIR}/jquery.cookie.js\
    #${SRC_DIR}/jquery.delayedObserver.js\

UI_TIMEPICKR_MODULES = ${UI_TIMEPICKR_FILES}

UI_TIMEPICKR        = ${DIST_DIR}/jquery.utils.js
UI_TIMEPICKR_MIN    = ${DIST_DIR}/jquery.utils.min.js

UI_TIMEPICKR_VER = `cat version.txt`
VER = sed s/@VERSION/${UI_TIMEPICKR_VER}/

JAR = java -jar ${BUILD_DIR}/js.jar

all: timepickr timepickrmin 
	@@echo " - Build complete!"

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

## ui.timepickr.js ##

timepickr: ${DIST_DIR} ${UI_TIMEPICKR}

${UI_TIMEPICKR}: ${UI_TIMEPICKR_MODULES}
	@@mkdir -p ${DIST_DIR}
	@@cat ${UI_TIMEPICKR_MODULES} | ${VER} > ${UI_TIMEPICKR};
	@@echo " -" ${UI_TIMEPICKR} ".. OK"

## jquery.utils.min.js ##

timepickrmin: ${UI_TIMEPICKR_MIN}

${UI_TIMEPICKR_MIN}: ${UI_TIMEPICKR}
	@@${JAR} ${BUILD_DIR}/build/min.js ${UI_TIMEPICKR} ${UI_TIMEPICKR_MIN}
	@@echo " -" ${UI_TIMEPICKR_MIN} ".. OK"


## clean up shits ##

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
