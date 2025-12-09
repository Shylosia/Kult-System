// ==UserScript==
// @name         KULT: Tarot System-V
// @author       巫洁鸾
// @version      1.4.0
// @description  KULT: Divinity Lost 专用塔罗系统。v1.4.0: 单张抽取时显示全量信息，多人牌阵保持随机精简。
// @license      MIT
// ==/UserScript==

let ext = seal.ext.find('KultTarotSystem-V');
if (!ext) {
    ext = seal.ext.new('KultTarotSystem-V', '巫洁鸾', '1.4.0');
    seal.ext.register(ext);
}

// === 1. 塔罗牌数据库  ===
// 来源：KULT: Divinity Lost Tarot Deck Rules
const TAROT_DB = {
    // === 大阿卡纳 (Major Arcana) ===
    majors: [
        { id: 0, name: "Anthropos", cn: "原人", basic: "觉醒之人。通往觉醒的道路以及人类真正的神性起源。", theme: "觉醒、神性起源、潜能" },
        { id: 1, name: "Demiurgos", cn: "造物主", basic: "造物主。现已失落的统治者，人类囚笼的创造者。", theme: "机械、系统、控制、造物主的阴影" },
        { id: 2, name: "Astaroth", cn: "亚斯塔禄", basic: "亚斯塔禄。地狱的统治者，造物主的阴影。", theme: "地狱、阴影、分裂、另一位神" },
        { id: 3, name: "Kether", cn: "王冠", basic: "执政官 Kether 与阶级法则。", theme: "法则：阶级、权威、统治" },
        { id: 4, name: "Chokmah", cn: "智慧", basic: "执政官 Chokmah 与顺从法则。", theme: "法则：顺从、宗教、狂热" },
        { id: 5, name: "Binah", cn: "理解", basic: "执政官 Binah 与归属法则。", theme: "法则：归属、家庭、传统" },
        { id: 6, name: "Chesed", cn: "慈悲", basic: "执政官 Chesed 与安全法则。", theme: "法则：安全、庇护、停滞" },
        { id: 7, name: "Geburah", cn: "严厉", basic: "执政官 Geburah 与律法法则。", theme: "法则：律法、惩罚、官僚" },
        { id: 8, name: "Tiphareth", cn: "美丽", basic: "执政官 Tiphareth 与魅力法则。", theme: "法则：魅力、诱惑、虚荣" },
        { id: 9, name: "Netzach", cn: "胜利", basic: "执政官 Netzach 与胜利法则。", theme: "法则：胜利、战争、冲突" },
        { id: 10, name: "Hod", cn: "荣耀", basic: "执政官 Hod 与荣耀法则。", theme: "法则：荣耀、传统、复仇" },
        { id: 11, name: "Yesod", cn: "基础", basic: "执政官 Yesod 与贪婪法则。", theme: "法则：贪婪、物质、建设" },
        { id: 12, name: "Malkuth", cn: "王国", basic: "执政官 Malkuth 与觉醒法则（曾为协同）。", theme: "法则：协同、觉醒、叛逆" },
        { id: 13, name: "Thaumiel", cn: "双生神", basic: "死亡天使 Thaumiel 与权力法则。", theme: "法则：权力、独裁、腐败" },
        { id: 14, name: "Chagidiel", cn: "阻碍者", basic: "死亡天使 Chagidiel 与虐待法则。", theme: "法则：虐待、亵渎儿童、父权" },
        { id: 15, name: "Sathariel", cn: "隐匿者", basic: "死亡天使 Sathariel 与排斥法则。", theme: "法则：排斥、孤立、虚无" },
        { id: 16, name: "Gamichicoth", cn: "吞噬者", basic: "死亡天使 Gamichicoth 与恐惧法则。", theme: "法则：恐惧、偏执、排外" },
        { id: 17, name: "Golab", cn: "燃烧者", basic: "死亡天使 Golab 与折磨法则。", theme: "法则：折磨、痛苦、施虐" },
        { id: 18, name: "Togarini", cn: "争斗者", basic: "死亡天使 Togarini 与强迫法则。", theme: "法则：强迫、艺术、疯狂创作" },
        { id: 19, name: "Hareb-Serap", cn: "乌鸦", basic: "死亡天使 Hareb-Serap 与冲突法则。", theme: "法则：冲突、谋杀、混乱" },
        { id: 20, name: "Samael", cn: "神之毒", basic: "死亡天使 Samael 与复仇法则。", theme: "法则：复仇、怨恨、报复" },
        { id: 21, name: "Gamaliel", cn: "猥亵者", basic: "死亡天使 Gamaliel 与欲望法则。", theme: "法则：欲望、性、堕落" },
        { id: 22, name: "Nahemoth", cn: "低语者", basic: "死亡天使 Nahemoth 与无序法则。", theme: "法则：无序、灾难、异变" }
    ],

    // === 小阿卡纳 (Minor Arcana) ===
    minors: {
        "Skulls": [
            {
                rank: 1, name: "Metropolis", cn: "大都会",
                basic: "人类的祖籍，永恒之城，造物主机器的核心。",
                ind: "哀悼的寡妇、空工厂看门人、绝望的建筑师",
                loc: "葬礼教堂、废墟城市、小巷迷宫、深渊",
                org: "第十一科、第三圣殿先知会",
                sit: "伟大感、慢性致死病、造物主的阴影",
                cre: "陨落之神的仆从、天界合唱团天使",
                item: "神堡画作、黑橡木棺材、骨灰瓮、钥匙圈"
            },
            {
                rank: 2, name: "Forgetfulness", cn: "遗忘",
                basic: "那些已从记忆中消逝的事物。",
                ind: "催眠师、健忘的会计、创伤受害者、分心的牧师",
                loc: "遗忘囚牢、封锁的金库、老人院、鬼镇",
                org: "讨论轮回的网络论坛、古老贵族家族的仆人",
                sit: "创伤事件、阿尔茨海默症、记忆丧失、洗脑",
                cre: "窃取记忆的生物、前世的幽灵",
                item: "笔记本、旧信件、毒品、缺少数字的公式"
            },
            {
                rank: 3, name: "Remnants", cn: "残余",
                basic: "死亡、破坏或变迁后遗留之物。",
                ind: "务实的考古学家、古怪的后裔、解散部队的士兵",
                loc: "远古废墟、废弃祖屋、海底沉船",
                org: "处理遗产的律所、祖先崇拜教团",
                sit: "家族秘密、血脉最后一人、幸存的弃儿",
                cre: "堕落天使、残破生物、食尸鬼",
                item: "书的最后一页、扭曲的录音带、自动求救信号"
            },
            {
                rank: 4, name: "Spirit", cn: "灵体",
                basic: "精神，非物质的本质，以及禁锢神性灵魂的机制。",
                ind: "拥有富豪客户的灵媒、能见鬼的郊区女孩",
                loc: "降灵会室、闹鬼的房子、古老墓地",
                org: "通灵学会、捉鬼敢死队",
                sit: "被附身、灵魂出窍、与死者交谈",
                cre: "幽灵、怨魂、食灵者",
                item: "污损的塔罗牌、被附身的娃娃、通灵板"
            },
            {
                rank: 5, name: "Transit", cn: "过渡",
                basic: "从生到死或进入另一种存在形式的过渡。",
                ind: "准备充分的杀手、濒死体验者、恋尸癖",
                loc: "堕胎诊所、墓穴暗门、通往死者之城的门",
                org: "行刑队、濒死体验研究组织",
                sit: "分娩中死亡、死而复生、被迫食人",
                cre: "边界行者、生死之间的生物",
                item: "防腐液注射器、除颤器、酒精浸泡的胎儿"
            },
            {
                rank: 6, name: "Flesh", cn: "血肉",
                basic: "死后的躯壳，或本该被释放却仍被囚禁的灵魂的牢笼。",
                ind: "变态外科医生、将死父绑在阁楼的疯子",
                loc: "不锈钢停尸房、万人坑、医学博物馆",
                org: "死亡法师协会、食人教团",
                sit: "严重麻风病、死尸复活、强制食人",
                cre: "受诅咒的军团士兵",
                item: "缝合的畸形尸体、人皮书、冰镇器官"
            },
            {
                rank: 7, name: "Weapon", cn: "武器",
                basic: "带来死亡的工具。通过暴力引发的变迁。",
                ind: "郊区义警、黑帮打手、精英狙击手",
                loc: "电椅室、战争纪念馆、军火库",
                org: "军火商、特种部队、雇佣兵团",
                sit: "私刑暴徒、飞车射击、武装抢劫、暗杀",
                cre: "以暴力和痛苦为食的生物",
                item: "锋利刀刃、冲锋枪、处决视频、核代码"
            },
            {
                rank: 8, name: "Suffering", cn: "受难",
                basic: "伴随死亡而来的痛苦与灵魂的净化。",
                ind: "自残的先知、专业施虐女王、审讯专家",
                loc: "炼狱、受难囚牢、隔音审讯室、BDSM俱乐部",
                org: "反恐秘密组织、Golab崇拜教团",
                sit: "痛苦骨癌、家庭内的虐待、恐怖闪回",
                cre: "炼狱使者、魔使、狰肢",
                item: "铁丝荆棘冠、水刑器具、锈蚀长钉"
            },
            {
                rank: 9, name: "Inferno", cn: "地狱",
                basic: "大都会的阴影，众多的地狱与神堡，亚斯塔禄意志流出的领域。",
                ind: "各种纹身师、发放刀片的邪教领袖、海洛因瘾君子",
                loc: "亚斯塔禄神堡、死亡天使神堡、酷刑迷宫",
                org: "寻求逃避世界的自杀教团",
                sit: "弃婴、临终秘密、黑金属乐队的召唤仪式",
                cre: "魔使、亚斯塔禄的化身",
                item: "开启界门的古钥匙、播放诡异曲调的唱片"
            }
        ],
        "Roses": [
            {
                rank: 1, name: "Gaia", cn: "盖亚",
                basic: "未被驯服的荒野，无法控制之物，原始的饥饿与赤裸的情感。",
                ind: "像野兽般的疯子、新异教自然崇拜者",
                loc: "盖亚边境、杂草丛生的房子、野兽巢穴",
                org: "崇拜原始荒野的教团",
                sit: "野蛮食人、被情感吞噬、弱肉强食",
                cre: "野化之神、哨兵",
                item: "通往荒野的地图、骨雕人像、杆上人头"
            },
            {
                rank: 2, name: "Birth", cn: "诞生",
                basic: "激情所生之物，新事物的开始，灵魂融入血肉。",
                ind: "严厉的助产士、抑郁的母亲、早产儿",
                loc: "破败产房、乡下孤儿院、狭窄隧道",
                org: "代孕中介、收养中心",
                sit: "婴儿降生、新的一天、家庭纽带、死胎",
                cre: "奇怪的后代、盖亚之子",
                item: "混血的母乳、空婴儿床、婴儿衣服下的利器"
            },
            {
                rank: 3, name: "Survival", cn: "生存",
                basic: "逆境求生的意志，适者生存，以钢铁般的意志战胜困难。",
                ind: "意志如铁的生存狂、特种兵、受虐主妇",
                loc: "荒野深处、战区、混乱街区、秘密地堡",
                org: "生存主义者网络、城市探险家",
                sit: "迷失荒野、被通缉、向强者投降",
                cre: "来自盖亚深处的生物",
                item: "门链、野战口粮、秘密路径地图"
            },
            {
                rank: 4, name: "Growth", cn: "生长",
                basic: "获得力量并扩张的事物，无论是意志、身体还是自然。",
                ind: "身体畸形的男孩、专注的健美运动员",
                loc: "被自然吞噬之地、发霉的房间、健身房",
                org: "生育诊所、扩张主义公司",
                sit: "观念演变为痴迷、基因突变、青春期",
                cre: "盖亚变异生物、情欲妖",
                item: "类固醇注射器、黑土中的种子、受精卵"
            },
            {
                rank: 5, name: "Predator", cn: "掠食者",
                basic: "猎手，饥饿者，捕食弱者之人。",
                ind: "有影响力的电影大亨、蛇蝎美人、连环杀手",
                loc: "红灯区破旅馆、深林小屋、剥皮谷仓",
                org: "谋杀崇拜教团、大型狩猎协会",
                sit: "欺凌弱小、夜间跟踪、引诱、伏击",
                cre: "诺斯费拉图、激情生物",
                item: "红口红、弹簧刀、避孕套、夜视仪"
            },
            {
                rank: 6, name: "Swarm", cn: "虫群",
                basic: "聚集，集体意识，被激情吞没并行动如一的暴民。",
                ind: "忠诚的追随者、驯兽师、激动的球迷",
                loc: "广场街道、蚊虫滋生的沼泽、集约化农场",
                org: "极端球迷会、宗教派系、工会激进分子",
                sit: "随波逐流、为了集体牺牲、拥挤交通",
                cre: "狼群、蟑螂群、泽洛斯虫族",
                item: "蜂蜜罐、火柴盒里的干蚂蚁、蝗虫胸针"
            },
            {
                rank: 7, name: "Prey", cn: "猎物",
                basic: "激情的受害者，或成为某种敌人或危险情况的目标。",
                ind: "被跟踪的名人、被勒索的顾家男人、逃犯",
                loc: "地下室隐秘牢房、空荡街道、安全屋",
                org: "性虐待幸存者互助小组",
                sit: "落入陷阱、被勒索、被跟踪",
                cre: "激情生物、夜裔",
                item: "哭泣求饶的录音、被盗护照、手提包里的手枪"
            },
            {
                rank: 8, name: "Obsession", cn: "痴迷",
                basic: "当激情掌控你时的紧握，你无法控制它，只能沦为其影响的受害者。",
                ind: "偷窥狂摄影师、古怪收藏家、自恋狂",
                loc: "脱衣舞俱乐部、音乐场所、暗网色情站",
                org: "偶像粉丝俱乐部、模特经纪公司",
                sit: "被激情奴役、不健康的欲望、毒瘾",
                cre: "情欲妖、Togarini的仆从",
                item: "八卦小报、裸照、贴满海报的墙"
            },
            {
                rank: 9, name: "Love", cn: "爱",
                basic: "一种可能比死亡更牢固的纽带。它能赐予力量与目标，也能将你拖垮成为你的厄运。",
                ind: "心碎的男人、无可救药的浪漫主义者、继父",
                loc: "高速路旁的汽车旅馆、林中小屋、婚纱店",
                org: "婚介所",
                sit: "疯狂坠入爱河、禁忌之爱、乱伦、蜜月",
                cre: "激情生物",
                item: "金戒指、结婚证、充满暧昧信息的手机"
            }
        ],
        "Hourglasses": [
            {
                rank: 1, name: "Achlys", cn: "艾柯吕斯",
                basic: "虚无，无限，空虚，以及灵魂本身的彻底消泯。",
                ind: "严重抑郁者、昏迷病人、失去信仰的牧师",
                loc: "太空真空、深井、感官剥夺箱、深海",
                org: "崇拜虚无女神的教团",
                sit: "灵魂毁灭、化为原子、被拖入深渊",
                cre: "幽冥之民、幻影",
                item: "感官剥夺箱、黑墨水、致命注射器、遗书"
            },
            {
                rank: 2, name: "Future", cn: "未来",
                basic: "尚未发生之事，以及尚未释放的潜能。",
                ind: "郊区算命师、预测分析教授、赌徒、天才",
                loc: "孤儿院、在建高速公路、建筑工地",
                org: "未来分析师、投资公司、科技大学",
                sit: "预言、复杂阴谋、塔罗占卜、众筹",
                cre: "来自未来的生物、无目之神",
                item: "旧怀表、充满预言的日记、摩天大楼蓝图"
            },
            {
                rank: 3, name: "Past", cn: "过去",
                basic: "已经发生并卷土重来之事，或者若你在对的地方寻找便能发现之事。",
                ind: "怀旧老人、古董商、考古学家、历史学家",
                loc: "被遗忘的博物馆、荒野废墟、尘封档案馆",
                org: "家谱研究中心、考古协会",
                sit: "考古挖掘、审讯",
                cre: "来自远古的生物、被遗忘的神",
                item: "家谱书、中世纪圣杯、老照片、出生证明"
            },
            {
                rank: 4, name: "Space", cn: "空间",
                basic: "在空间中向着目标前行或永远在运动的人或物。",
                ind: "卡车司机、背包客、逃犯、离家出走的孩子",
                loc: "无尽公路、铁路、货运电梯",
                org: "搬家公司、航运公司、人口贩卖集团",
                sit: "船旅、火车行、追逐、高速飙车",
                cre: "癫狂舞者、公路之神、传送生物",
                item: "GPS手机、水壶、鞋子、护照"
            },
            {
                rank: 5, name: "Borderland", cn: "边境",
                basic: "两个世界或两种存在状态之间的地方，或是时空与物质世界交汇之处。",
                ind: "被收买的海关、双重人格移民、外交官",
                loc: "幻觉薄弱之地、河岸、边境检查站、大使馆",
                org: "守卫边境的教团",
                sit: "存在于两界之间、不确定的忠诚、僵局",
                cre: "边界行者",
                item: "介绍信、身份文件、指南针、外交护照"
            },
            {
                rank: 6, name: "Hidden", cn: "隐匿",
                basic: "被遮蔽及隐藏于视线之外的事物。",
                ind: "卧底特工、非法移民、越狱犯、伪装士兵",
                loc: "黯界都、隐秘圣所、恐慌室、走私路线",
                org: "间谍机构、秘密社团",
                sit: "卧底行动、避开麻烦、潜台词",
                cre: "幽冥之民、隐形怪物",
                item: "安全屋钥匙、密道地图、古代神器"
            },
            {
                rank: 7, name: "Labyrinth", cn: "迷宫",
                basic: "充满危险与困惑的迷宫，与幽冥之渊紧密相连。",
                ind: "解决难题的数学家、精神病人、洞穴探险家",
                loc: "下水道、蜿蜒小巷、树篱迷宫、地铁隧道",
                org: "崇拜地下生物的教团",
                sit: "迷失方向、伏击、绕圈子、奇怪回声",
                cre: "凯拉斯、泽洛斯、格兰桑希尔",
                item: "古罗盘、千片拼图、疯子写的代码"
            },
            {
                rank: 8, name: "Crossroad", cn: "十字路口",
                basic: "连接两条截然不同的道路，必须做出的选择，以及两个截然不同的结果。",
                ind: "逃避过去的女人、受压迫政客、堕胎少女",
                loc: "十字路口、高速匝道、火车站、地铁入口",
                org: "生育诊所、博彩公司",
                sit: "重要选择、艰难两难、分手、玩枪的孩子",
                cre: "契约编织者、交换商人",
                item: "改变生活的信、背包、老虎机"
            },
            {
                rank: 9, name: "Gate", cn: "门扉",
                basic: "必须跨越或被守护的门槛或障碍。",
                ind: "保安、锁匠、黑客、拒绝他人的经理",
                loc: "银行金库、废屋之门、桥下通道、传送门",
                org: "银行、边境卫队、守护秘密的教团",
                sit: "需要开启之物、被保护之物、遗忘记忆",
                cre: "守门人、开路者",
                item: "加密文件、未知语言书、挂锁、红药丸"
            }
        ],
        "Crescents": [
            {
                rank: 1, name: "Vortex", cn: "漩涡",
                basic: "创造、梦境以及源自混沌幽域深处不断变化的混乱的源头。",
                ind: "改变世界的梦想家、危险的煽动者、梦境法师",
                loc: "漩涡、梦境世界、破碎的梦",
                org: "秘密魔法师结社、睡眠诊所",
                sit: "混乱与世界改变、龙卷风、大漩涡",
                cre: "梦境诸君、梦境生物、梦境法师",
                item: "魔法神器、古波斯地毯、瓶中梦"
            },
            {
                rank: 2, name: "Creation", cn: "创造",
                basic: "塑造世界的原始神力，将思想与梦境转化为鼓舞人心之物。",
                ind: "灵感画家、著名建筑师、疯狂科学家、哑童",
                loc: "摩天大楼、奇怪声学的厅堂、不断变化的梦",
                org: "古典艺术基金会、艺术家集体",
                sit: "空气中的旋律、艺术展览",
                cre: "活化的人造生物、依靠美生存的濒死生物",
                item: "绘图板、大师画作、被诅咒的乐器"
            },
            {
                rank: 3, name: "Undoing", cn: "毁灭",
                basic: "思想、结构、身体、梦境及整个世界崩溃与消泯的自然循环的一部分。",
                ind: "冷血杀手、战犯、公司清算律师、审查狂",
                loc: "被侵蚀的建筑、垃圾处理厂、集中营",
                org: "拆迁公司、末日邪教、虚无主义自杀教团",
                sit: "掩盖真相、删除信息、股市崩盘、火灾",
                cre: "凯拉斯、吞噬破坏之物",
                item: "轰炸机、焚化炉、酸液桶、电脑病毒"
            },
            {
                rank: 4, name: "Transformation", cn: "转化",
                basic: "极端的改变与变形状态。",
                ind: "实验整形医生、体验派演员、极端身体改造者",
                loc: "景观建筑公司、基因实验室、转化中心",
                org: "草根政治运动、身体改造者",
                sit: "变心、戒除恶习、绝症、变性、整容",
                cre: "变形怪",
                item: "化妆包、茧、工具箱、油漆桶、狂欢面具"
            },
            {
                rank: 5, name: "Connection", cn: "连接",
                basic: "交织的结构、意志，或是阻碍你或助你前行的事物。",
                ind: "贪婪中间人、说客、网络技术员、后宫之主",
                loc: "群岛、小村庄、十字路口、高围栏、河口",
                org: "黑客组织、恐怖小组网络、贩毒集团",
                sit: "阴谋、被困被抓、束缚、扩张",
                cre: "特克隆、傀儡大师",
                item: "服务器网络、渔网、蜘蛛网、手铐、脑缸"
            },
            {
                rank: 6, name: "Merging", cn: "融合",
                basic: "思想、身体与心灵的融合。二者合为一。",
                ind: "好心牧师、连体双胞胎、并购经理、魅力领袖",
                loc: "河流交汇处、合并的城市",
                org: "跨国公司",
                sit: "爱的行为、宣誓入教、融入背景、神话成真",
                cre: "凯拉斯、激情生物",
                item: "熔合的塑料、藏刃十字架、十二童之血"
            },
            {
                rank: 7, name: "Reflection", cn: "反射",
                basic: "倒影可能揭示真相，可能具有欺骗性，或者可能反映一个人或一个地点。",
                ind: "同卵双胞胎、骗子灵媒、业余导演、模仿者",
                loc: "静止池塘、嘉年华、镜厅、雨湿街道",
                org: "Malkuth教团、哲学协会",
                sit: "海市蜃楼、幻觉、洞察真相、既视感",
                cre: "多重身",
                item: "橱窗、镜子、褪色照片、水晶球"
            },
            {
                rank: 8, name: "Repetition", cn: "重复",
                basic: "无尽的循环，重复的主题，既视感，或你无法逃避的事物。",
                ind: "读信的邮递员、电话性爱接线员、电视迷宅男",
                loc: "婚礼教堂、政府办公室、廉价夜总会",
                org: "保守智库、制药公司",
                sit: "翻唱乐队、吃老本、既视感、重复程序",
                cre: "阿克罗提德、特克隆、无脑幽灵",
                item: "仓鼠轮、被拒剧本、重复旋律的八音盒"
            },
            {
                rank: 9, name: "Stillness", cn: "静止",
                basic: "冷漠、宁静，以及看似恒久不变的情境。",
                ind: "冷静的大师、放弃的主妇、说谜语的老嬉皮",
                loc: "沉睡小镇、死胡同、枯山水、鬼镇",
                org: "冥想中心、情感研究中心",
                sit: "平静日子、一成不变的同学会、严格家宴",
                cre: "遗忘本性的失落之神",
                item: "安眠药、平静音乐CD、沙漠画作"
            }
        ],
        "Eyes": [
            {
                rank: 1, name: "Elysium", cn: "极乐",
                basic: "幻觉的核心，以及将你锁在链条中的复杂机器。",
                ind: "大权在握的政客、神职领袖、顶级军官、传媒大亨",
                loc: "政府大楼、大教堂、历史纪念碑、被占领土",
                org: "军队内的教团、沉睡的大众、精英秘密结社",
                sit: "文化价值观、家庭聚会、传统节日",
                cre: "督法使、无形法则、幻象守护者",
                item: "法典、政治宣传、国旗、眼罩、镇静剂"
            },
            {
                rank: 2, name: "Imprisonment", cn: "囚禁",
                basic: "对你的身体、灵魂和思想的囚禁。",
                ind: "警察、典狱长、校长、线人、特工、法官",
                loc: "高安监狱、拘留室、高中、银行办公室",
                org: "执法者、学校系统、银行系统、司法系统",
                sit: "待付账单、债务、被通缉、受教育",
                cre: "长老、督法使",
                item: "手铐、轮椅、严格规则列表、监控摄像头"
            },
            {
                rank: 3, name: "Faith", cn: "信仰",
                basic: "赋予你目标但使你盲目的信仰。",
                ind: "电视传教士、公关人员、迷醉主妇、顽固无神论者",
                loc: "偏僻寺庙、古老教堂、体育场、宏伟纪念碑",
                org: "宗教派系、马克思主义团体、恐怖小组",
                sit: "仪式、体育赛事、祈祷、净化仪式、捐款",
                cre: "Chokmah的天使",
                item: "生锈的十字架钉、宗教服饰、政治宣传海报"
            },
            {
                rank: 4, name: "Distractions", cn: "干扰",
                basic: "日常生活中使你对真相视而不见的事物。",
                ind: "侵入式推销员、邻家辣妹、街头小贩、网络红人",
                loc: "电影院、购物中心、度假胜地、脱衣舞俱乐部",
                org: "广告公司、时尚公司、快餐连锁",
                sit: "社交媒体丑闻、电视节目、新闻、广告、八卦",
                cre: "曼西比姆、激情生物、伪装者",
                item: "智能手机、电子游戏、色情片、廉价酒精"
            },
            {
                rank: 5, name: "Division", cn: "分裂",
                basic: "让我们忙于无休止的斗争。",
                ind: "网络喷子、极右翼成员、仇男权主义者、伊玛目",
                loc: "社交媒体、网络论坛、地下室藏身处",
                org: "少数族裔团体、右翼政党、网络仇恨团体",
                sit: "政治集会、骚扰、死亡威胁、纵火、仇恨言论",
                cre: "Hareb-Serap和Gamichicoth的仆从",
                item: "仇恨宣传品、种族主义小册子、挑衅歌曲"
            },
            {
                rank: 6, name: "Rebellion", cn: "叛逆",
                basic: "对统治秩序的反抗与斗争。",
                ind: "固执独行者、叛逆少年、罪犯、魅力政治领袖",
                loc: "被占领的房子、地下俱乐部、生存狂之家",
                org: "游击队、朋克乐队、极端组织、动物权利运动",
                sit: "革命、暴动、音乐会、政治集会、示威",
                cre: "Malkuth的天使、食尸鬼",
                item: "宣传册、喷漆罐、恐吓信、钢头靴"
            },
            {
                rank: 7, name: "Madness", cn: "疯狂",
                basic: "压倒并撕裂你，但也可能赐予洞察力的疯狂。",
                ind: "发狂病人、施虐护工、妄想爵士乐手、被藏女孩",
                loc: "疯人院、隔离室、破旧房子、撕毁壁纸的公寓",
                org: "愚人众、心理研究所、拖车公园邪教",
                sit: "精神病、重度抑郁、PTSD、焦虑、偏执",
                cre: "疯狂生物",
                item: "烧毁的娃娃、病人日记、精神药物、束缚衣"
            },
            {
                rank: 8, name: "Visions", cn: "异象",
                basic: "可能带来洞察，但也可能引入歧途的幻象。",
                ind: "郊区神谕、自封先知、灵感建筑师、怪诞艺术家",
                loc: "古庙、嘉年华、烟雾缭绕的鸦片馆、疯人院",
                org: "解梦者、朝圣者",
                sit: "噩梦般的幻象、清晰洞察、预言、谣言",
                cre: "生于噩梦和幻象的生物、占卜者",
                item: "8毫米摄像机、迷幻药、装饰陶罐、网页"
            },
            {
                rank: 9, name: "Enlightenment", cn: "启蒙",
                basic: "可能引领你走向启蒙与觉醒的道路。",
                ind: "业余哲学家、魔术师、精明技师、濒临发现的科学家",
                loc: "通往未知之路、扭曲楼梯、高科技实验室",
                org: "服务Malkuth的教团、研究所、建筑公司",
                sit: "入会仪式、科学展览、教派会议",
                cre: "夜之子、觉醒人类、阿门托拉兹",
                item: "未知来源地图、旧软盘、疯狂涂鸦日记"
            }
        ]
    }
};

// === 2. 牌阵模板 ===
const SPREAD_TEMPLATES = {
    // 通用五星阵
    "default": {
        name: "五星阵 (通用)",
        positions: [
            { name: "1. 核心 (Core)", type: "general" },
            { name: "2. 过去 (Past)", type: "general" },
            { name: "3. 动力 (Ambition)", type: "general" },
            { name: "4. 弱点 (Weakness)", type: "general" },
            { name: "5. 优势 (Strength)", type: "general" }
        ]
    },
    // 人物塑造 (Individual)
    "individual": {
        name: "人物塑造 (Individual)",
        positions: [
            { name: "1. 核心特质", type: "ind" },
            { name: "2. 过去的塑造", type: "ind" },
            { name: "3. 驱动的野心", type: "ind" },
            { name: "4. 最大的弱点", type: "ind" },
            { name: "5. 最大的优势", type: "ind" }
        ]
    },
    // 地点生成 (Location)
    "location": {
        name: "地点生成 (Location)",
        positions: [
            { name: "1. 地点类型", type: "loc" },
            { name: "2. 地点历史", type: "loc" },
            { name: "3. 怪癖/特征", type: "loc" },
            { name: "4. 弱点/隐患", type: "loc" },
            { name: "5. 独特/卓越之处", type: "loc" }
        ]
    },
    // 教团/组织 (Cult/Organization)
    "cult": {
        name: "教团/组织 (Cult)",
        positions: [
            { name: "1. 驱动力量/野心", type: "org" },
            { name: "2. 重要历史", type: "org" },
            { name: "3. 想要达成的目标", type: "org" },
            { name: "4. 弱点/敌人", type: "org" },
            { name: "5. 意外的资源", type: "org" }
        ]
    },
    // 阴谋/剧情 (Plot/Situation)
    "plot": {
        name: "阴谋/剧情 (Plot)",
        positions: [
            { name: "1. 幕后力量", type: "sit" },
            { name: "2. 阴谋起因", type: "sit" },
            { name: "3. 下一步行动", type: "sit" },
            { name: "4. 反对势力", type: "sit" },
            { name: "5. 支持势力", type: "sit" }
        ]
    },
    // 怪物/存在 (Creature)
    "creature": {
        name: "怪物/存在 (Creature)",
        positions: [
            { name: "1. 背景起源", type: "cre" },
            { name: "2. 信息来源", type: "cre" },
            { name: "3. 驱动力", type: "cre" },
            { name: "4. 弱点", type: "cre" },
            { name: "5. 优势/能力", type: "cre" }
        ]
    },
    // 物品/神器 (Artifact/Item)
    "artifact": {
        name: "神器/物品 (Artifact)",
        positions: [
            { name: "1. 起源", type: "item" },
            { name: "2. 谁在寻找它", type: "item" },
            { name: "3. 使用的危险", type: "item" },
            { name: "4. 主要力量", type: "item" },
            { name: "5. 次要力量", type: "item" }
        ]
    },
    // 单张抽取模板 (特殊逻辑)
    "single": {
        name: "单张指引",
        positions: [
            { name: "1. 结果", type: "all" }
        ]
    }
};

// === 3. 辅助函数 ===
function sample(arr, count) {
    let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function splitAndPick(str) {
    if (!str) return "无";
    let parts = str.split('、');
    return parts[Math.floor(Math.random() * parts.length)];
}

// === 4. 指令逻辑 ===
const cmdKultTarot = seal.ext.newCmdItemInfo();
cmdKultTarot.name = 'kulttarot';
cmdKultTarot.help = `KULT 塔罗系统 (v1.5)
================================
指令: .kt [类型] 或 .kulttarot [类型]
不填类型则默认抽取通用五星阵。

可用类型指令：
- .kt 单张 / draw: 随机抽一张牌 (含全部解释)
- .kt 人 / ind   : 生成NPC/人物
- .kt 地 / loc   : 生成地点/场景
- .kt 组织 / org : 生成教团/组织
- .kt 事件 / sit : 生成阴谋/剧情
- .kt 怪物 / cre : 生成怪物/生物
- .kt 物品 / item: 生成神器/物品
- .kt help       : 显示此帮助
================================`;

cmdKultTarot.solve = function (ctx, msg, argv) {
    const arg = argv.getArgN(1).toLowerCase();
    
    // Help
    if (arg === 'help' || arg === '-h') {
        const ret = seal.ext.newCmdExecuteResult(true);
        ret.showHelp = true;
        return ret;
    }

    // 确定模板
    let templateKey = "default";
    let drawCount = 5;

    const map = {
        "人": "individual", "ind": "individual", "individual": "individual",
        "地": "location", "loc": "location", "location": "location",
        "组织": "cult", "org": "cult", "cult": "cult",
        "事件": "plot", "sit": "plot", "plot": "plot", "situation": "plot",
        "怪物": "creature", "cre": "creature", "creature": "creature",
        "物品": "artifact", "item": "artifact", "artifact": "artifact",
        "单张": "single", "draw": "single", "1": "single", "one": "single"
    };
    
    if (map[arg]) templateKey = map[arg];
    if (templateKey === "single") drawCount = 1;

    const template = SPREAD_TEMPLATES[templateKey];

    // 抽牌 (68张: 0-22 Major, 23-67 Minor)
    let drawIds = sample(Array.from({length: 68}, (_, i) => i), drawCount);
    
    let output = `>>> KULT 塔罗占卜: ${template.name}\n\n`;

    for (let i = 0; i < drawCount; i++) {
        let id = drawIds[i];
        let pos = template.positions[i];
        let cardText = "";
        let cardName = "";

        // 解析卡牌数据
        if (id <= 22) {
            // 大阿卡纳
            let card = TAROT_DB.majors[id];
            cardName = `【${card.id}】${card.cn} (${card.name})`;
            cardText = `【基本义】${card.basic}\n【原则】${card.theme}`;
            
            // 如果是单张抽取，大阿卡纳显示就这些，因为没有详细分类
        } else {
            // 小阿卡纳
            let minorType = "";
            let rank = 0;
            
            if (id >= 23 && id <= 31) { minorType = "Skulls"; rank = id - 22; }
            else if (id >= 32 && id <= 40) { minorType = "Roses"; rank = id - 31; }
            else if (id >= 41 && id <= 49) { minorType = "Hourglasses"; rank = id - 40; }
            else if (id >= 50 && id <= 58) { minorType = "Eyes"; rank = id - 49; }
            else if (id >= 59 && id <= 67) { minorType = "Crescents"; rank = id - 58; }

            let card = TAROT_DB.minors[minorType][rank - 1]; 
            cardName = `【${rank}】${card.cn} (${card.name})`;
            let basicText = `【基本义】${card.basic}\n`;
            
            // 根据模板类型获取特定文本
            if (templateKey === "single") {
                // 单张全解模式: 显示所有字段，不随机
                cardText = basicText +
                           `【人物】${card.ind}\n` +
                           `【地点】${card.loc}\n` +
                           `【组织】${card.org}\n` +
                           `【情境】${card.sit}\n` +
                           `【生物】${card.cre}\n` +
                           `【物品】${card.item}`;
            } else if (pos.type === "general") {
                // 通用五星阵: 随机抽取一项显示
                cardText = basicText + 
                           `【人物】${splitAndPick(card.ind)}\n` +
                           `【地点】${splitAndPick(card.loc)}\n` +
                           `【情境】${splitAndPick(card.sit)}`;
            } else {
                // 特定主题模式: 随机抽取该主题的一项
                let content = card[pos.type] || "无详细描述";
                const keyMap = { "ind": "人物", "loc": "地点", "org": "组织", "sit": "情境", "cre": "生物", "item": "物品" };
                cardText = basicText + `【${keyMap[pos.type]}】${splitAndPick(content)}`;
            }
        }

        output += `${pos.name}\n`;
        output += `牌名: ${cardName}\n`;
        output += `${cardText}\n`;
        if (i < drawCount - 1) output += `--------------------\n`;
    }

    seal.replyToSender(ctx, msg, output);
    return seal.ext.newCmdExecuteResult(true);
};

// 注册
ext.cmdMap['kt'] = cmdKultTarot;
ext.cmdMap['kulttarot'] = cmdKultTarot;