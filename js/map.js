var mapID = 'g'
var mapPos = [3,3]
var mapLoc = "Grass Field"

window.addEventListener('keydown', e=>{
    if (e.keyCode == 65 || e.keyCode == 37) moveMap(-1,0)
    if (e.keyCode == 68 || e.keyCode == 39) moveMap(1,0)
    if (e.keyCode == 87 || e.keyCode == 38) moveMap(0,-1)
    if (e.keyCode == 83 || e.keyCode == 40) moveMap(0,1)
})

const MAP = [
    [null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null],
    [null,null,null,'opt',null,null,null],
    [null,null,'auto','g','pc','gh',null],
    [null,null,null,'p','chal',null,null],
    [null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null],
]

const MAP_UNLS = {
	g: _ => true,
	opt: _ => true,
	auto: _ => true,
	p: _ => true,
	pc: _ => true,
	chal: _ => player.cTimes > 0,
	gh: _ => player.cTimes > 0
}

const MAP_LOCS = {
	g: "Grass Field",
	opt: "Miscellaneous",
	auto: "Upgrades",
	p: "Upgrades",
	pc: "Prestige",
	chal: "Challenges",
	gh: "Prestige"
}

const MAP_IDS = (_=>{
    let x = []
    for (i in MAP) for (j in MAP[i]) if (MAP[i][j]) x.push(MAP[i][j])
    return x
})()

function unlockedMap(dx,dy) {
	let i = MAP?.[dy]?.[dx] 
	return MAP_UNLS[i] && MAP_UNLS[i]()
}

function moveMap(dx,dy) {
    switchMap(mapPos[0]+dx,mapPos[1]+dy)
}

function switchMap(mx,my) {
    if (unlockedMap(mx,my)) {
        mapPos[0] = mx
        mapPos[1] = my

        mapID = MAP[my][mx]
        showLoc(MAP_LOCS[mapID])
    }
}

el.update.map = _=>{
    for (x in MAP_IDS) {
        let id = MAP_IDS[x]
        let m_div = tmp.el["map_div_"+id]

        if (m_div) m_div.setDisplay(id == mapID)
    }

    let [mx,my] = mapPos

    tmp.el.lMap.setClasses({locked: !unlockedMap(mx-1,my)})
    tmp.el.rMap.setClasses({locked: !unlockedMap(mx+1,my)})
    tmp.el.uMap.setClasses({locked: !unlockedMap(mx,my-1)})
    tmp.el.dMap.setClasses({locked: !unlockedMap(mx,my+1)})
}

/**/
let locTimeout
function showLoc(x) {
	if (x == mapLoc) return
	mapLoc = x

	tmp.el.loc.setHTML(x)
	tmp.el.loc.setOpacity(1)

	clearTimeout(locTimeout)
	locTimeout = setTimeout(() => tmp.el.loc.setOpacity(0), 3000)
}