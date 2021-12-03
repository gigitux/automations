/**
 * External dependencies
 */
const core = require( '@actions/core' );

/**
 * Internal dependencies
 */
const { getTemplate, TEMPLATES, compile } = require( './templates' );
const { lineBreak } = require( '../../utils' );
const debug = require( '../../debug' );
const {
	getReleaseVersion,
	isPatchRelease,
	getReleaseBranch,
	duplicateChecker,
	hasMilestone: getHasMilestone,
} = require( './utils' );
const {
	getChangelog,
	getChangelogItems,
	getDevNoteItems,
} = require( '../../utils/changelog' );
const attachChangelogToRelease = require( './utils/attach-changelog-to-release' );

/**
 * @typedef {import('../../typedefs').GitHubContext} GitHubContext
 * @typedef {import('../../typedefs').GitHub} GitHub
 * @typedef {import('../../typedefs').ReleaseConfig} ReleaseConfig
 */

/**
 * @param {GitHubContext} context
 * @param {GitHub} octokit
 * @param {ReleaseConfig} config
 */
const releaseHandler = async ( context, octokit, config ) => {
	core.debug(
		'Received config in branchHandler: ' + JSON.stringify( config )
	);
	// get release version.
	const releaseVersion = getReleaseVersion( context.release.name );

	const changelogItems = await getChangelogItems(
		context,
		octokit,
		releaseVersion,
		config
	);
	const changelog = await getChangelog( changelogItems, config );
	await attachChangelogToRelease( context, octokit, changelog );
};

exports.releaseHandler = releaseHandler;
