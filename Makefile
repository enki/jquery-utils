SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DOCS_DIR = ${PREFIX}/docs
TEST_DIR = ${PREFIX}/test
DIST_DIR = ${PREFIX}/dist
SPEED_DIR = ${PREFIX}/speed

BASE_FILES = ${SRC_DIR}/jquery.utils.js\
	${SRC_DIR}/jquery.anchorHandler.js\
	${SRC_DIR}/jquery.cookie.js\
	${SRC_DIR}/jquery.countdown.js\
    ${SRC_DIR}/jquery.cycle.js\
    ${SRC_DIR}/jquery.delayedObserver.js\
    ${SRC_DIR}/jquery.flash.js\
    ${SRC_DIR}/jquery.forms.js\
    ${SRC_DIR}/jquery.ifixpng.js\
    ${SRC_DIR}/jquery.strings.js\
     ${SRC_DIR}/jquery.valid.js
#    ${SRC_DIR}/jquery.youtubeLinksToEmbed.js

MODULES = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

JQ = ${DIST_DIR}/jquery-utils.js
JQ_LITE = ${DIST_DIR}/jquery-utils.lite.js
JQ_MIN = ${DIST_DIR}/jquery-utils.min.js
JQ_PACK = ${DIST_DIR}/jquery-utils.pack.js

JQ_VER = `cat version.txt`
VER = sed s/@VERSION/${JQ_VER}/

JAR = java -jar ${BUILD_DIR}/js.jar

all: jquery lite min pack #speed
	@@echo "jQuery build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

jquery: ${DIST_DIR} ${JQ}

${JQ}: ${MODULES}
	@@echo "Building" ${JQ}

	@@mkdir -p ${DIST_DIR}
	@@cat ${MODULES} | ${VER} > ${JQ};

	@@echo ${JQ} "Built"
	@@echo

lite: ${JQ_LITE}

${JQ_LITE}: ${JQ}
	@@echo "Building" ${JQ_LITE}

	@@echo " - Removing ScriptDoc from" ${JQ}
	@@${JAR} ${BUILD_DIR}/build/lite.js ${JQ} ${JQ_LITE}

	@@echo ${JQ_LITE} "Built"
	@@echo

pack: ${JQ_PACK}

${JQ_PACK}: ${JQ}
	@@echo "Building" ${JQ_PACK}

	@@echo " - Compressing using Packer"
	@@${JAR} ${BUILD_DIR}/build/pack.js ${JQ} ${JQ_PACK}

	@@echo ${JQ_PACK} "Built"
	@@echo

min: ${JQ_MIN}

${JQ_MIN}: ${JQ}
	@@echo "Building" ${JQ_MIN}

	@@echo " - Compressing using Minifier"
	@@${JAR} ${BUILD_DIR}/build/min.js ${JQ} ${JQ_MIN}

	@@echo ${JQ_MIN} "Built"
	@@echo

test: ${JQ}
	@@echo "Building Test Suite"
	@@echo "Test Suite Built"
	@@echo

runtest: ${JQ} test
	@@echo "Running Automated Test Suite"
	@@${JAR} ${BUILD_DIR}/runtest/test.js

	@@echo "Test Suite Finished"
	@@echo

#docs: ${JQ}
#	@@echo "Building Documentation"
#
#	@@echo " - Making Documentation Directory:" ${DOCS_DIR}
#	@@mkdir -p ${DOCS_DIR}
#	@@mkdir -p ${DOCS_DIR}/data
#
#	@@echo " - Copying over htaccess file."
#	@@cp -fR ${BUILD_DIR}/docs/.htaccess ${DOCS_DIR}
#
#	@@echo " - Copying over script files."
#	@@cp -fR ${BUILD_DIR}/docs/js ${DOCS_DIR}/js
#
#	@@echo " - Copying over style files."
#	@@cp -fR ${BUILD_DIR}/docs/style ${DOCS_DIR}/style
#
#	@@echo " - Extracting ScriptDoc from" ${JQ}
#	@@${JAR} ${BUILD_DIR}/docs/docs.js ${JQ} ${DOCS_DIR}
#
#	@@echo "Documentation Built"
#	@@echo

#speed: ${JQ}
#	@@echo "Building Speed Test Suite"
#
#	@@echo " - Making Speed Test Suite Directory:" ${SPEED_DIR}
#	@@mkdir -p ${SPEED_DIR}
#
#	@@echo " - Copying over script files."
#	@@cp -f ${BUILD_DIR}/speed/index.html ${SPEED_DIR}
#	@@cp -f ${BUILD_DIR}/speed/benchmarker.css ${SPEED_DIR}
#	@@cp -f ${BUILD_DIR}/speed/benchmarker.js ${SPEED_DIR}
#	@@cp -f ${BUILD_DIR}/speed/jquery-1.1.2.js ${SPEED_DIR}

#	@@echo "Speed Test Suite Built"
#	@@echo

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing Test Suite directory:" ${TEST_DIR}
	@@rm -rf ${TEST_DIR}

	@@echo "Removing Documentation directory:" ${DOCS_DIR}
	@@rm -rf ${DOCS_DIR}

	@@echo "Removing Speed Test Suite directory:" ${SPEED_DIR}
	@@rm -rf ${SPEED_DIR}
