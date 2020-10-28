const Web3 = require('web3');

module.exports = async function (context, req) {
    var web3 = new Web3('http://20.48.2.62:8545');
    context.log('JavaScript HTTP trigger function processed a request.');

    const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

    const blockNumber = await promisify(cb => web3.eth.getBlockNumber(cb));
    const num = (req.query.block || (req.body && req.body.block)) ? (req.query.block || (req.body && req.body.block)) : 1;

    const hash = (req.query.hash || (req.body && req.body.hash));

    let transactions = {};
    if (hash) {
        transactions =  await promisify(cb => web3.eth.getTransaction(hash,cb));
    }
    
    const block = await promisify(cb => web3.eth.getBlock(num,cb));
    
    context.res = {
    // status: 200, /* Defaults to 200 */
    body: { results: { 
        latestBlocks: blockNumber,
        block: { ...block },
        transaction: { ...transactions}
      }},
      headers: {
          'Content-Type': 'application/json'
      },
    };
}