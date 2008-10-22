SRC_DIR   = src
BUILD_DIR = build
PREFIX    = .
DIST_DIR  = ${PREFIX}/dist

BASE_FILES = ${SRC_DIR}/jquery.utils.js\
    ${SRC_DIR}/jquery.anchorHandler.js\
    ${SRC_DIR}/jquery.cookie.js\
    ${SRC_DIR}/jquery.countdown.js\
    ${SRC_DIR}/jquery.cycle.js\
    ${SRC_DIR}/jquery.delayedObserver.js\
    ${SRC_DIR}/jquery.flash.js\
    ${SRC_DIR}/jquery.i18n.js\
    ${SRC_DIR}/jquery.ifixpng.js\
    ${SRC_DIR}/jquery.mousewheel.js\
    ${SRC_DIR}/jquery.strings.js\
    ${SRC_DIR}/jquery.timeago.js\
    ${SRC_DIR}/jquery.valid.js\
    ${SRC_DIR}/jquery.youtubeLinksToEmbed.js\
#   ${SRC_DIR}/jquery.forms.js\
#   ${SRC_DIR}/jquery.jpath.js\
#   ${SRC_DIR}/api.youtube.js\

UI_FILES = ${SRC_DIR}/jquery.ui.all.js\
 	${SRC_DIR}/ui.toaster.js\
 	${SRC_DIR}/ui.masked.js\
#	${SRC_DIR}/ui.datetime.js\
#	${SRC_DIR}/ui.keynav.js\
#	${SRC_DIR}/ui.awesomebar.js\
#	${SRC_DIR}/ui.imgSelection.js\
#	${SRC_DIR}/ui.imgTools.js\
#	${SRC_DIR}/ui.window.js\

MODULES  = ${BASE_FILES}
MODULES2 = ${BASE_FILES}${UI_FILES}

JQ_UTILS        = ${DIST_DIR}/jquery.utils.js
JQ_UTILS_MIN    = ${DIST_DIR}/jquery.utils.min.js
JQ_UTILS_UI     = ${DIST_DIR}/jquery.utils.ui.js
JQ_UTILS_UI_MIN = ${DIST_DIR}/jquery.utils.ui.min.js

JQ_VER = `cat version.txt`
VER = sed s/@VERSION/${JQ_VER}/

JAR = java -jar ${BUILD_DIR}/js.jar

all: utils utilsmin utilsui utilsuimin
	@@echo " - Build complete!"

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

## Jquery.utils.js ##

utils: ${DIST_DIR} ${JQ_UTILS}

${JQ_UTILS}: ${MODULES}
	@@mkdir -p ${DIST_DIR}
	@@cat ${MODULES} | ${VER} > ${JQ_UTILS};
	@@echo " -" ${JQ_UTILS} ".. OK"

## jquery.utils.min.js ##

utilsmin: ${JQ_UTILS_MIN}

${JQ_UTILS_MIN}: ${JQ_UTILS}
	@@${JAR} ${BUILD_DIR}/build/min.js ${JQ_UTILS} ${JQ_UTILS_MIN}
	@@echo " -" ${JQ_UTILS_MIN} ".. OK"

## Jquery.utils.ui.js ##

utilsui: ${DIST_DIR} ${JQ_UTILS_UI}

${JQ_UTILS_UI}: ${MODULES2}
	@@mkdir -p ${DIST_DIR}
	@@cat ${MODULES2} | ${VER} > ${JQ_UTILS_UI};
	@@echo " -" ${JQ_UTILS_UI} ".. OK"

## Jquery.utils.ui.js ##

utilsuimin: ${DIST_DIR} ${JQ_UTILS_UI_MIN}

${JQ_UTILS_UI_MIN}: ${MODULES2}
	@@${JAR} ${BUILD_DIR}/build/min.js ${JQ_UTILS_UI} ${JQ_UTILS_UI_MIN}
	@@echo " -" ${JQ_UTILS_UI_MIN} ".. OK"

## clean up shits ##

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
