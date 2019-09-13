const config = require('config');
const SiteFactoryClient = require('./lib/site-factory-client');
const fs = require('fs');

const factoryConn = config.get('factoryConnection');

const client = new SiteFactoryClient({
  username: factoryConn.username,
  apikey: factoryConn.apikey,
  factoryHost: factoryConn.factoryHost
});


async function main() {
  try {

    const [sitelist, domainlist] = await Promise.all([
      client.sites.list(), // List of ACSF sites
      getDomains()         // List of domains
    ]);

    doAssignments(sitelist, domainlist);

  } catch (err) {
    console.error(err);
  }
}

async function doAssignments(sitelist, domainlist) {

  sitePromises = [];
  sitelist.forEach(site => {
    sitePromises += doPerSiteAssignments(site.id, domainlist[site.site]);
  });
  await Promise.all(sitePromises);
}

async function doPerSiteAssignments(siteId, domainInfo){

  // Make sure the default domain is assinged first.
  await client.domains.add(siteId, domainInfo.default);

  // Set the additonal domains
  additionalSites = [];
  domainInfo.additional.forEach(domain => {
    additionalSites += client.domains.add(siteId, domain);
  });

  await Promise.all(additionalSites);
}

/**
 * Retrieve a list of the domains which are mapped to each
 * of the ACSF sites.
 *
 * {
 *   "host": {
 *     "default": "default.cancer.gov",
 *     "additional": [
 *       "name1.cancer.gov",
 *       "name2.cancer.gov"
 *     ]
 *   }
 * }
 *
 */
async function getDomains() {
  return new Promise((resolve, reject) => {
    fs.readFile('domainlist.json', function read(err, data) {
      if (err)
        reject(err);
      else
        resolve(JSON.parse(data));
    });
  });
}

main();
