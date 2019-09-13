# cgov-digital-platform-tools
Support tools for the CGov Digital Platform

## Background
Acquia only covers backing up servers for the purposes of data center disaster recovery, not botched deployments or accidental deletions of content. As such we need to ensure that we are taking nightly backups, as well as being able to support on-demand backups prior to deployments. Additionally, we will need other tooling such as log file fetching, and in the future, log file processing. This project is to collect all these tools so that we may run them on our operations servers.

## Approach
We started by trying to containerize Drush commands, but found that you pretty much need a full Drupal install in order to simply run the acsf-tools package. The tools package is actually, just a series of curl commands or wrappers around other drush commands. We can easily make web requests in node, so it seemed easier to create node scripts that could be called from shell. (Via CommanderJS)

## Tools

### Domain Mapping

Sets up the domain mappings for an ACSF lower tier.

_This is an ongoing work-in-progress._

#### Get an ACSF API Key
1. Log in to the production Site Factory site.
2. In the upper-right corner of the page, click on your email address.
3. Click on the "API key" tab.
4. Copy your API key to a _safe_ location. This key allows anyone who has it to take actions as _you_.

#### Setup.
1. CLone this repository.
2. run `npm install`
3. In `<REPO_BASE>/config`, copy `default.json` to `local.json`.  This is where _your_ individual settings go.
4. Replace the following items:
   * **username:** The email address associated with your ACSF account.
   * **apikey:** Your API key (See above)
   * **factoryHost:** The fully-qualified DEV or TEST Site Factory site name.
5. From the Box "Sensitive Files" directory, copy either `domainlist.json.dev` or `domainlist.json.test` and place it in `<REPO_BASE>` as `domainlist.json`.  This file lists the domains associated with each of the hostnames on a given tier.

#### Run the script

From `<REPO_ROOT>`, execute the command `node index.js`.
