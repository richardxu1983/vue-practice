
import FT from '../../mlGame/core/fight.js'
import SK from '../../mlGame/data/skill.js'
import WPD from '../../mlGame/data/wpData.js'
import DT from '../../mlGame/data/gData.js'
import NPCD from '../../mlGame/data/npc.js'
var Fight = FT.Fight;
var $wp = WPD.wp;
var skl = SK.FSKL;
var $npc = NPCD.npc;

class Unit
{
    //构造函数
    constructor()
    {
        this.attr = {
            'id':0,
            'head':"",
            'name':"",
            'lvl':1,
            'type':0,
            'weapon':0,
            'hp' : 0,
            'hpmax' : 0,
            'atkBase' : 0,
            'mtkBase' : 0,
            'defBase' : 0,
            'fireBase' : 0,
            'iceBase' : 0,
            'poisBase' : 0,
            'spdBase' : 0,
            'hpmaxBase':0,
            'atk':0,
            'mtk':0,
            'spd':0,
            'def':0,
            'fire':0,
            'ice':0,
            'pois':0,
            'fskl':[],
        };

        //战斗中的状态数值
        this.ft = 
        {
            t:0,
            eff:[],
            'atk':0,
            'mtk':0,
            'spd':0,
            'def':0,
            'fire':0,
            'ice':0,
            'pois':0,
            'atkp':0,
            'mtkp':0,
            'spdp':0,
            'defp':0,
            'firep':0,
            'icep':0,
            'poisp':0,
        };

        this.ftOn = false;
    }

    ftInit()
    {
        this.ft.t=0;
        this.eff=[];
        this.ft.atk=0;
        this.ft.mtk=0;
        this.ft.spd=0;
        this.ft.def=0;
        this.ft.fire=0;
        this.ft.ice=0;
        this.ft.pois=0;
        this.ft.atkp=0;
        this.ft.mtkp=0;
        this.ft.spdp=0;
        this.ft.defp=0;
        this.ft.firep=0;
        this.ft.icep=0;
        this.ft.poisp=0;
    }

    id(v)
    {
        if(v)
        {
            this.setAttr('id', v)
        }
        else
        {
            return this.getAttr('id');
        }
    }

    type(v)
    {
        if(v)
        {
            this.setAttr('type', v)
        }
        else
        {
            return this.getAttr('type');
        }
    }

    weapon(v)
    {
        if(v)
        {
            this.setAttr('weapon', v)
        }
        else
        {
            return this.getAttr('weapon');
        }
    }

    head(v)
    {
        if(v)
        {
            this.setAttr('head', v)
        }
        else
        {
            return this.getAttr('head');
        }
    }

    //
    hp(v)
    {
        if(v)
        {
            this.setAttr('hp', v)
        }
        else
        {
            return this.getAttr('hp');
        }
    }

    name(v)
    {
        if(v)
        {
            this.setAttr('name', v)
        }
        else
        {
            return this.getAttr('name');
        }
    }

    lvl(v)
    {
        if(v)
        {
            this.setAttr('lvl', v)
        }
        else
        {
            return this.getAttr('lvl');
        }
    }

    fskl()
    {
        return this.getAttr('fskl');
    }

    attrCheck()
    {
        var atk = $wp[this.weapon()].atk +this.attr['atkBase'];
        var mtk = this.attr['mtkBase'];
        var hpmax = this.attr['hpmaxBase'];
        var spd = this.attr['spdBase'];
        var def = this.attr['defBase'];
        var fire = this.attr['fireBase'];
        var ice = this.attr['iceBase'];
        var pois = this.attr['poisBase'];

        if(this.ftOn)
        {
            atk+=this.ft.atk;
            mtk+=this.ft.mtk;
            spd+=this.ft.spd;
            def+=this.ft.def;
            fire+=this.ft.fire;
            ice+=this.ft.ice;
            pois+=this.ft.pois;

            atk*=(1+this.ft.atkp/100);
            mtk*=(1+this.ft.mtkp/100);
            spd*=(1+this.ft.spdp/100);
            def*=(1+this.ft.defp/100);
            fire*=(1+this.ft.firep/100);
            ice*=(1+this.ft.icep/100);
            pois*=(1+this.ft.poisp/100);

        }

        this.setAttr('atk', atk);
        this.setAttr('mtk', mtk);
        this.setAttr('hpmax', hpmax);
        this.setAttr('spd', spd);
        this.setAttr('def', def);
        this.setAttr('fire', fire);
        this.setAttr('ice', ice);
        this.setAttr('pois', pois);
    }

    addSkToFight(id)
    {
        if(skl[id]==undefined)
            return;

        if(this.attr.fskl.length>=3)
            return;

        var len = this.attr.fskl.length;

        for(var i=0;i<len;i++)
        {
            if(this.attr.fskl[i].id==id)
                return;
        }

        this.attr.fskl.push({'id':id,lvl:1});
    }

    fsklLvlUp(index)
    {
        if(!this.attr.fskl[index])
            return;

        var lvl = this.attr.fskl[index].lvl;
        var id = this.attr.fskl[index].id;
        var max = skl[id].maxLvl;

        if(lvl>=max)
            return;

        this.attr.fskl[index].lvl++;
    }

    getAttr(v)
    {
        return this.attr[v];
    }

    setAttr(attr , val)
    {
        this.attr[attr] = val;
        this.onSetAttr(attr ,val);
    }

    atkDis()
    {
        return $wp[this.weapon()].atkDis;
    }

    atk()
    {
        return this.getAttr('atk');
    }

    mtk()
    {
        return this.getAttr('mtk');
    }

    def()
    {
        return this.getAttr('def');
    }

    damage(val)
    {
        var hp = this.hp();
        hp = hp - val;
        if(hp<=0)
        {
            hp = 0;
            this.setAttr('hp',hp);
            return -1;
        }
        this.setAttr('hp',hp);
        return 1;
    }

    addAttr(attr , val)
    {
        var n = this.getAttr(attr) + val;
        this.setAttr(attr, n);
    }

    equipWp(id)
    {
        if(Fight.over==0)
        {
            this.setAttr('weapon',id);
            this.attrCheck();
            this.onEqWp(id);
        }
    }

    unEquipWp()
    {
        if(Fight.over==0)
        {
            this.setAttr('weapon',0);
            this.attrCheck();
            this.onEqWp(0);
        }
    }

    onEqWp(id){}
    onUnEqWp(){}
    onSetAttr(attr ,newVal){}
}

class Npc extends Unit 
{ 
    constructor(id,weaponid)
    { 
        super();
        this.id(id);
        this.weapon(weaponid);
        this.attrInit();
        this.attrCheck();
        this.name($npc[id].name);
    }

    attrInit()
    {
        var id = this.id();
        var base = $npc[id].attr;
        var hp = base.hp;
        var atk = base.atk;
        var mtk = base.mtk;
        var def = base.def;
        var spd = base.spd;
        this.setAttr('hp',hp);
        this.setAttr('hpmaxBase',hp);
        this.setAttr('atkBase',atk);
        this.setAttr('mtkBase',mtk);
        this.setAttr('spdBase',spd);
        this.setAttr('defBase',def);
        this.setAttr('fireBase',0);
        this.setAttr('iceBase',0);
        this.setAttr('poisBase',0);
    }
}

//extend(Player,Unit);
var unitCtrl = {
    npcName:function(id)
    {
        return $npc[id].name;
    }
}

export default { Unit , Npc,unitCtrl};