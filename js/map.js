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
    [null,null,null,'opt','stats','rp',null],
    [null,null,'auto','g','pc','gh','fd'],
    [null,null,null,'p','chal','as',null],
    [null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null],
]

const MAP_UNLS = {
	g: _ => true,
	opt: _ => true,
	auto: _ => true,
	p: _ => true,
	pc: _ => true,
	stats: _ => player.pTimes > 0,
	chal: _ => player.cTimes > 0,
	gh: _ => player.cTimes > 0,
	fd: _ => hasUpgrade('factory', 0),
	as: _ => hasUpgrade('factory', 3),
	rp: _ => hasUpgrade('factory', 6)
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
        //delete player.map_notify[mapID]
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

	updateMapButton("lMap", mx-1, my)
	updateMapButton("rMap", mx+1, my)
	updateMapButton("uMap", mx, my-1)
	updateMapButton("dMap", mx, my+1)
}

function updateMapButton(el, mx, my) {
	const mapId = MAP?.[my]?.[mx]
	tmp.el[el].setClasses({
		map_btn: true,
		locked: !unlockedMap(mx,my),
		[MAP_COLORS[mapId]]: unlockedMap(mx,my)/* && !player.map_notify[mapId],
		notify: player.map_notify[mapId],*/
	})
}

/* EXTENSION */
el.update.map_ext = _ => {
	let mapId = MAP[mapPos[1]][mapPos[0]]
	tmp.el.position.setTxt(`(${mapPos[0]},${mapPos[1]}) ${MAP_LOCS[mapId]}: ${GO_TO_NAMES[mapId]}`)

	tmp.el.map_div.setDisplay(go_to)
	if (go_to) {
		for (const [y, dy] of Object.entries(MAP)) {
			for (const [x, dx] of Object.entries(dy)) {
				if (dx !== null) {
					const unl = MAP_UNLS[dx]()
					tmp.el["map_btn_"+dx].setDisplay(unl)
					if (unl) updateMapButton("map_btn_"+dx, x, y)
				}
			}
		}
	}
}

const MAP_COLORS = {
	opt: "misc",
	stats: "misc",

	g: "grass",
	p: "grass",
	auto: "grass",
	pc: "pp",
	chal: "crystal",
	gh: "gh",
	fd: "gh",
	as: "gh",
	rp: "gh"
}

const MAP_LOCS = {
	opt: "Misc",
	stats: "Misc",

	g: "Field",
	auto: "Upgrades",
	p: "Upgrades",
	pc: "Prestige",
	chal: "Challenges",
	gh: "Prestige",
	fd: "Factory",
	as: "Factory",
	rp: "Factory"
}

let locTimeout
function showLoc(x) {
	if (x == mapLoc) return
	mapLoc = x

	tmp.el.loc.setHTML(x)
	tmp.el.loc.setOpacity(1)

	clearTimeout(locTimeout)
	locTimeout = setTimeout(() => tmp.el.loc.setOpacity(0), 3000)
}

//Map
const GO_TO_NAMES = {
	opt: "Options",
	stats: "Stats",

	g: "Field",
	auto: "Automation",
	p: "Upgrades",
	pc: "Prestige",
	chal: "Challenges",
	gh: "Grasshop",
	fd: "Foundry",
	as: "Assembler",
	rp: "Rocket"
}

let go_to = false
el.setup.go_to = _ => {
	let html = "<table>"
	for (const [y, dy] of Object.entries(MAP)) {
		html += "<tr>"
		for (const [x, dx] of Object.entries(dy)) {
			html += "<td>"
			if (dx !== null) html += `<button id="map_btn_${dx}" onclick="switchMap(${x}, ${y})">${GO_TO_NAMES[dx]}</button>`
			html += "</td>"
		}
		html += "</tr>"
	}
	html += "</table>"
	new Element("map_div").setHTML(html)
}

//Notifications
const MAP_NOTIFY = {
	opt: _ => 0,
	stats: _ => player.pTimes > 0 ? 1 : 0,

	g: _ => 0,
	p: _ => player.cTimes > 0 || player.tier >= 2 ? 2 :
		player.pTimes > 0 || player.level >= 1 ? 1 :
		0,
	auto: _ => player.pTimes > 0 || player.level >= 5 ? 1 :
		0,
	pc: _ => player.cTimes > 0 || player.level > 100 ? 2 :
		player.pTimes > 0 || player.level >= 30 ? 1 :
		0,
	chal: _ => player.sTimes > 0 ? 2 :
		player.cTimes > 0 ? 1 :
		0,
	gh: _ => player.grasshop + (player.level >= MAIN.gh.req() ? 1 : 0),
	fd: _ => hasUpgrade("factory", 2) ? 3 :
		hasUpgrade("factory", 1) ? 2 :
		hasUpgrade("factory", 0) ? 1 :
		0,
	as: _ => hasUpgrade("factory", 5) ? 3 :
		hasUpgrade("factory", 4) ? 2 :
		hasUpgrade("factory", 3) ? 1 :
		0,
	rp: _ => hasUpgrade("factory", 6) ? 1 : 0,
}

tmp_update.push(_=>{
    for (let [id, cond] of Object.entries(MAP_NOTIFY)) {
        cond = cond()
		if (tmp.map_notify[id] === undefined) tmp.map_notify[id] = cond
		if (cond > tmp.map_notify[id]) {
			tmp.map_notify[id] = cond
			player.map_notify[id] = 1
		}
    }
})