// forward repl
if(window.location.href.includes('repl')){
    window.location.href = "https://bitcoin.anthony.media";
}

let amountInput = document.querySelector(".data-dollars-input");
let amountDisplay = document.querySelector(".data-btc-per-dollar");
let portfolioInput = document.querySelector(".data-portfolio-input");
let portfolioDisplay = document.querySelector(".data-portfolio-dollar");

const bitcoinData = {
    price: null,
    lastPrice: null,
    change: null,
    supply: null,
    open: null,
    exchange: "Coinbase Pro"
}


function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = numberWithCommas(Math.floor(progress * (end - start) + start));
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function numberWithCommas(num) {
    decimal = num.toString().split(".");
    if(!decimal[1]) {
        decimal[1] = '00';
    }
    decimal[0] = decimal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal[0] + '.' + decimal[1];

}
async function getBitcoinOpenPrice(){
    await fetch('https://www.bitstamp.net/api/v2/ticker/btcusd/')
    .then(response => response.json())
    .then(data => {
        bitcoinData.open = data.open;
    })
}
async function getBitcoinSupply(){
    await fetch('https://blockchain.info/q/totalbc')
    .then(response => response.json())
    .then(data => {
        bitcoinData.supply = parseInt(data / 100000000);
        updateMarketCap();
    })
}
async function getBitcoinPrice(){
    await fetch('https://api.coinbase.com/v2/prices/spot?currency=USD')
    .then(response => response.json())
    .then(data => {
        bitcoinData.lastPrice = bitcoinData.price;
        bitcoinData.price = parseFloat(data.data.amount);
        bitcoinData.change = (bitcoinData.price - bitcoinData.lastPrice).toFixed(2);});
}
function updateMarketCap(){
    // update market cap 
        let marketCap = numberWithCommas(bitcoinData.price * bitcoinData.supply)
        document.querySelector('.data-market-cap').innerHTML = `\$${marketCap}`;
}
function displayPrice(){
    document.querySelector(".price").innerHTML = numberWithCommas(bitcoinData.price);
    document.querySelector(".price").setAttribute("data-price", bitcoinData.price);
    document.title = "$" + numberWithCommas(bitcoinData.price) + " BTC/USD";
    

    if(bitcoinData.price === bitcoinData.lastPrice){
        return document.querySelector(".price").setAttribute("class", "price");
    } else if(bitcoinData.price >= bitcoinData.lastPrice){
        document.querySelector(".price").setAttribute("class", "price gain");
    } else {
        document.querySelector(".price").setAttribute("class", "price loss");
    }
}

async function renderPrice(){ 
    await getBitcoinPrice();
    displayPrice();
    updateAmtInBTC();
    updatePortfolio();
    if(parseFloat(bitcoinData.change) != 0 && (bitcoinData.lastPrice != bitcoinData.price)){
        svgRender(parseFloat(bitcoinData.change));
        animateValue(document.querySelector(".price"), bitcoinData.lastPrice, bitcoinData.price, 1000);
    }
    console.log(`New price: ${bitcoinData.price}, old price: ${bitcoinData.lastPrice} | Change: ${bitcoinData.change}`);
}
// Execute the price render on load
renderPrice();
getBitcoinSupply();
getBitcoinOpenPrice()

// set the interval
setInterval(renderPrice, 60000);
setInterval(getBitcoinSupply, 10000);

// Amount calculations
function calcAmtInBTC(amt){
    let dollar = parseFloat(amt);
    return dollar / bitcoinData.price
}
function updateAmtInBTC(){
     if (amountInput.value === ""){
        return amountDisplay.innerHTML = " - "
    }
    let amount = amountInput.value || 0;
    let bitcoins = calcAmtInBTC(amountInput.value).toFixed(8);
    return amountDisplay.innerHTML = numberWithCommas(bitcoins) + " BTC"
}
function updatePortfolio(){
    amt = parseFloat(portfolioInput.value);
    portfolioDisplay.innerHTML = numberWithCommas(Math.floor(amt * bitcoinData.price));
}

amountInput.addEventListener("input", () => {
        updateAmtInBTC();
        // amountInput.value = numberWithCommas(amountInput.value);
})

portfolioInput.addEventListener("input", () => {
        updatePortfolio();
        // amountInput.value = numberWithCommas(amountInput.value);
})