function calc(dt) {
    let decel = player.decel
    let recel = player.recel

    let outsideNormal = decel || recel

    tmp.spawn_time += dt
    tmp.autocutTime += dt
    player.time += dt
    player.pTime += dt
    player.cTime += dt
    player.sTime += dt
    player.aTime += dt
    player.lTime += dt
    player.fTime += dt
    player.nTime += dt
    player.gTime += dt
    player.sacTime += dt

    if (tmp.spawn_time >= tmp.grassSpawn) {
        while (tmp.spawn_time >= tmp.grassSpawn) {
            tmp.spawn_time -= tmp.grassSpawn
            for (let i=0;i<tmp.spawnAmt;i++) createGrass()
        }
        tmp.spawn_time = 0
    }

    if (tmp.autocutTime >= tmp.autocut && tmp.grasses.length > 0 && hasUpgrade('auto',0)) {
        while (tmp.autocutTime >= tmp.autocut) {
            tmp.autocutTime -= tmp.autocut
            for (let i=0;i<tmp.autocutAmt;i++) removeGrass(randint(0, tmp.grasses.length-1),true)
        }
        tmp.autocutTime = 0
    }

    player.maxPerk = Math.max(player.maxPerk, tmp.perks)

    for (let x in UPGS) if (tmp.upgs[x].autoUnl && !(['grass','pp','crystal'].includes(x) && outsideNormal) && !(['aGrass'].includes(x) && !outsideNormal)) if (player.autoUpg[x]) buyAllUpgrades(x,true)

    if (tmp.ppGainP > 0 && player.level >= 30 && !outsideNormal) player.pp = player.pp.add(tmp.ppGain.mul(dt*tmp.ppGainP))
    if (tmp.crystalGainP > 0 && player.level >= 100 && !outsideNormal) player.crystal = player.crystal.add(tmp.crystalGain.mul(dt*tmp.crystalGainP))

    if (hasUpgrade('factory',7)) {
        player.ap = player.ap.add(player.bestAP2.mul(dt*tmp.oilRigBase))
        player.oil = player.oil.add(player.bestOil2.mul(dt*tmp.oilRigBase))
    }

    if (tmp.steelPass > 0) {
        player.steel = player.steel.add(tmp.steelGain.mul(tmp.steelPass*dt))
    }

    if (hasUpgrade('factory',2)) player.chargeRate = player.chargeRate.add(tmp.chargeGain.mul(dt))

    player.bestGrass = player.bestGrass.max(player.grass)
    player.bestPP = player.bestPP.max(player.pp)
    player.bestCrystal = player.bestCrystal.max(player.crystal)
    player.bestCharge = player.bestCharge.max(player.chargeRate)

    player.aBestGrass = player.aBestGrass.max(player.aGrass)
    player.bestAP = player.bestAP.max(player.ap)
    player.bestOil = player.bestOil.max(player.oil)

    player.unBestGrass = player.unBestGrass.max(player.unGrass)
    player.bestNP = player.bestNP.max(player.np)

    if (player.level >= 200 && !player.chalUnl) player.chalUnl = true

    if (!inChal(-1)) {
        let p = player.chal.progress
        player.chal.comp[p] = Math.min(Math.max(player.chal.comp[p]||0,tmp.chal.bulk),CHALS[p].max)
    }

    if (player.lowGH <= 16 && player.decel) {
        player.bestAP2 = player.bestAP2.max(tmp.apGain)
        player.bestOil2 = player.bestOil2.max(tmp.oilGain)
    }

    if (hasUpgrade('funnyMachine',1)) {
        player.SFRGT = player.SFRGT.add(tmp.SFRGTgain.mul(dt))
    }

    if (hasStarTree('auto',10)) ROCKET.create()

    if (hasStarTree('auto',14)) RESET.rocket_part.reset(false,true)

    MAIN.checkCutting()

    if (player.autoGH && !tmp.outsideNormal) RESET.gh.reset()
    if (player.autoGS && player.decel) RESET.gs.reset()
}