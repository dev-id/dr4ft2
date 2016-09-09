const fs = require('fs')

const Cards = require('../../data/cards')
const Sets = require('../../data/sets')
const custom = require('../../data/custom')

if (custom.cards) {
  console.log("Making custom set (old format) " + custom.code)
  makeCustomSet(custom)
}
else {
  for (var customset in custom) {
    console.log("Making custom set " + customset)
    makeCustomSet(custom[customset])
  }
}

function makeCustomSet(customset) {
  var code = customset.code
  var packsize = customset.packsize || 10
  if (Sets[code]) {
    console.log('already processed, exiting')
    return
  }
  const set = Sets[code] = {
    common: [],
    uncommon: [],
    rare: [],
    mythic: [],
    size: packsize
  }
  makeCustomCards(customset.cards, set, code)
}

function makeCustomCards(cards, set, code) {
  const COLORS = {
    W: 'white',
    U: 'blue',
    B: 'black',
    R: 'red',
    G: 'green'
  }

  cards.forEach(rawCard => {
    const rarity = rawCard.rarity.split(' ')[0].toLowerCase()
    if (rarity === 'basic')
       return

    const {name} = rawCard
    const lc = name.toLowerCase()
    set[rarity].push(lc)

    const sets = {[code]: { rarity, url: rawCard.url }}
    if (Cards[lc])
      return Cards[lc].sets[code] = sets[code]

    const {cid} = rawCard
    const color
      = cid.length === 1 ? COLORS[cid[0]]
      : !cid.length ? 'colorless'
      : 'multicolor'

    Cards[lc] = {
      cmc: rawCard.cmc,
      color,
      name,
      type: rawCard.type.split(' ')[0],
      sets
    }
  })
}

fs.writeFileSync('data/cards.json', JSON.stringify(Cards, null, 2))
fs.writeFileSync('data/sets.json', JSON.stringify(Sets, null, 2))
