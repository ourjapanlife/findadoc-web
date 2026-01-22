export enum Region {
    Hokkaido = 'HOKKAIDO',
    Tohoku = 'TOHOKU',
    Kanto = 'KANTO',
    Chubu = 'CHUBU',
    Kansai = 'KANSAI',
    Chugoku = 'CHUGOKU',
    Shikoku = 'SHIKOKU',
    Kyushu = 'KYUSHU',
    Okinawa = 'OKINAWA'
}

export enum Prefecture {
    Hokkaido = 'HOKKAIDO',
    Aomori = 'AOMORI',
    Iwate = 'IWATE',
    Miyagi = 'MIYAGI',
    Akita = 'AKITA',
    Yamagata = 'YAMAGATA',
    Fukushima = 'FUKUSHIMA',
    Ibaraki = 'IBARAKI',
    Tochigi = 'TOCHIGI',
    Gunma = 'GUNMA',
    Saitama = 'SAITAMA',
    Chiba = 'CHIBA',
    Tokyo = 'TOKYO',
    Kanagawa = 'KANAGAWA',
    Niigata = 'NIIGATA',
    Toyama = 'TOYAMA',
    Ishikawa = 'ISHIKAWA',
    Fukui = 'FUKUI',
    Yamanashi = 'YAMANASHI',
    Nagano = 'NAGANO',
    Gifu = 'GIFU',
    Shizuoka = 'SHIZUOKA',
    Aichi = 'AICHI',
    Mie = 'MIE',
    Shiga = 'SHIGA',
    Kyoto = 'KYOTO',
    Osaka = 'OSAKA',
    Hyogo = 'HYOGO',
    Nara = 'NARA',
    Wakayama = 'WAKAYAMA',
    Tottori = 'TOTTORI',
    Shimane = 'SHIMANE',
    Okayama = 'OKAYAMA',
    Hiroshima = 'HIROSHIMA',
    Yamaguchi = 'YAMAGUCHI',
    Tokushima = 'TOKUSHIMA',
    Kagawa = 'KAGAWA',
    Ehime = 'EHIME',
    Kochi = 'KOCHI',
    Fukuoka = 'FUKUOKA',
    Saga = 'SAGA',
    Nagasaki = 'NAGASAKI',
    Kumamoto = 'KUMAMOTO',
    Oita = 'OITA',
    Miyazaki = 'MIYAZAKI',
    Kagoshima = 'KAGOSHIMA',
    Okinawa = 'OKINAWA'
}

// Arrays
export const regionsEnum: Region[] = [
    Region.Hokkaido, Region.Tohoku, Region.Kanto, Region.Chubu, Region.Kansai, Region.Chugoku,
    Region.Shikoku, Region.Kyushu, Region.Okinawa
]

export const prefecturesEnum: Prefecture[] = [
    Prefecture.Hokkaido, Prefecture.Aomori, Prefecture.Iwate, Prefecture.Miyagi,
    Prefecture.Akita, Prefecture.Yamagata, Prefecture.Fukushima, Prefecture.Ibaraki,
    Prefecture.Tochigi, Prefecture.Gunma, Prefecture.Saitama, Prefecture.Chiba,
    Prefecture.Tokyo, Prefecture.Kanagawa, Prefecture.Niigata, Prefecture.Toyama,
    Prefecture.Ishikawa, Prefecture.Fukui, Prefecture.Yamanashi, Prefecture.Nagano,
    Prefecture.Gifu, Prefecture.Shizuoka, Prefecture.Aichi, Prefecture.Mie,
    Prefecture.Shiga, Prefecture.Kyoto, Prefecture.Osaka, Prefecture.Hyogo,
    Prefecture.Nara, Prefecture.Wakayama, Prefecture.Tottori, Prefecture.Shimane,
    Prefecture.Okayama, Prefecture.Hiroshima, Prefecture.Yamaguchi, Prefecture.Tokushima,
    Prefecture.Kagawa, Prefecture.Ehime, Prefecture.Kochi, Prefecture.Fukuoka,
    Prefecture.Saga, Prefecture.Nagasaki, Prefecture.Kumamoto, Prefecture.Oita,
    Prefecture.Miyazaki, Prefecture.Kagoshima, Prefecture.Okinawa
]

// Complete enum of all Japanese cities organized by prefecture
export enum City {
    // HOKKAIDO (31 cities)
    HokkaidoSapporo = 'HOKKAIDO_SAPPORO', HokkaidoHakodate = 'HOKKAIDO_HAKODATE', HokkaidoAsahikawa = 'HOKKAIDO_ASAHIKAWA',
    HokkaidoKushiro = 'HOKKAIDO_KUSHIRO', HokkaidoObihiro = 'HOKKAIDO_OBIHIRO', HokkaidoKitami = 'HOKKAIDO_KITAMI',
    HokkaidoOtaru = 'HOKKAIDO_OTARU', HokkaidoMuroran = 'HOKKAIDO_MURORAN', HokkaidoTomakomai = 'HOKKAIDO_TOMAKOMAI',
    HokkaidoWakkanai = 'HOKKAIDO_WAKKANAI', HokkaidoNayoro = 'HOKKAIDO_NAYORO', HokkaidoBibai = 'HOKKAIDO_BIBAI',
    HokkaidoAshibetsu = 'HOKKAIDO_ASHIBETSU', HokkaidoEbetsu = 'HOKKAIDO_EBETSU', HokkaidoAkabira = 'HOKKAIDO_AKABIRA',
    HokkaidoMonbetsu = 'HOKKAIDO_MONBETSU', HokkaidoShibetsu = 'HOKKAIDO_SHIBETSU', HokkaidoNemuro = 'HOKKAIDO_NEMURO',
    HokkaidoChitose = 'HOKKAIDO_CHITOSE', HokkaidoTakikawa = 'HOKKAIDO_TAKIKAWA', HokkaidoSunagawa = 'HOKKAIDO_SUNAGAWA',
    HokkaidoUtashinai = 'HOKKAIDO_UTASHINAI', HokkaidoFukagawa = 'HOKKAIDO_FUKAGAWA', HokkaidoFurano = 'HOKKAIDO_FURANO',
    HokkaidoNoboribetsu = 'HOKKAIDO_NOBORIBETSU', HokkaidoEniwa = 'HOKKAIDO_ENIWA', HokkaidoDate = 'HOKKAIDO_DATE',
    HokkaidoKitahiroshima = 'HOKKAIDO_KITAHIROSHIMA', HokkaidoIshikari = 'HOKKAIDO_ISHIKARI', HokkaidoHokuto = 'HOKKAIDO_HOKUTO',

    // AOMORI (10 cities)
    AomoriAomori = 'AOMORI_AOMORI', AomoriHirosaki = 'AOMORI_HIROSAKI', AomoriHachinohe = 'AOMORI_HACHINOHE',
    AomoriGoshogawara = 'AOMORI_GOSHOGAWARA', AomoriTowada = 'AOMORI_TOWADA', AomoriMisawa = 'AOMORI_MISAWA',
    AomoriKuroishi = 'AOMORI_KUROISHI', AomoriMutsu = 'AOMORI_MUTSU', AomoriTsugaru = 'AOMORI_TSUGARU',
    AomoriHirakawa = 'AOMORI_HIRAKAWA',

    // IWATE (14 cities)
    IwateMorioka = 'IWATE_MORIOKA', IwateMiyako = 'IWATE_MIYAKO', IwateOfunato = 'IWATE_OFUNATO',
    IwateHanamaki = 'IWATE_HANAMAKI', IwateKitakami = 'IWATE_KITAKAMI', IwateKuji = 'IWATE_KUJI',
    IwateTono = 'IWATE_TONO', IwateIchinoseki = 'IWATE_ICHINOSEKI', IwateRikuzentakata = 'IWATE_RIKUZENTAKATA',
    IwateKamaishi = 'IWATE_KAMAISHI', IwateNinohe = 'IWATE_NINOHE', IwateHachimantai = 'IWATE_HACHIMANTAI',
    IwateOshu = 'IWATE_OSHU', IwateTakizawa = 'IWATE_TAKIZAWA',

    // MIYAGI (14 cities)
    MiyagiSendai = 'MIYAGI_SENDAI', MiyagiIshinomaki = 'MIYAGI_ISHINOMAKI', MiyagiShiogama = 'MIYAGI_SHIOGAMA',
    MiyagiKesennuma = 'MIYAGI_KESENNUMA', MiyagiShiroishi = 'MIYAGI_SHIROISHI', MiyagiNatori = 'MIYAGI_NATORI',
    MiyagiKakuda = 'MIYAGI_KAKUDA', MiyagiTagajo = 'MIYAGI_TAGAJO', MiyagiIwanuma = 'MIYAGI_IWANUMA',
    MiyagiTomiya = 'MIYAGI_TOMIYA', MiyagiOsaki = 'MIYAGI_OSAKI', MiyagiKurihara = 'MIYAGI_KURIHARA',
    MiyagiHigashimatsushima = 'MIYAGI_HIGASHIMATSUSHIMA', MiyagiWatari = 'MIYAGI_WATARI',

    // AKITA (13 cities)
    AkitaAkita = 'AKITA_AKITA', AkitaNoshiro = 'AKITA_NOSHIRO', AkitaYokote = 'AKITA_YOKOTE',
    AkitaOdate = 'AKITA_ODATE', AkitaOga = 'AKITA_OGA', AkitaYuzawa = 'AKITA_YUZAWA',
    AkitaKatagami = 'AKITA_KATAGAMI', AkitaDaisen = 'AKITA_DAISEN', AkitaKitaakita = 'AKITA_KITAAKITA',
    AkitaSemboku = 'AKITA_SEMBOKU', AkitaNikaho = 'AKITA_NIKAHO',

    // YAMAGATA (13 cities)
    YamagataYamagata = 'YAMAGATA_YAMAGATA', YamagataYonezawa = 'YAMAGATA_YONEZAWA', YamagataTsuruoka = 'YAMAGATA_TSURUOKA',
    YamagataSakata = 'YAMAGATA_SAKATA', YamagataShinjo = 'YAMAGATA_SHINJO', YamagataSagae = 'YAMAGATA_SAGAE',
    YamagataKaminoyama = 'YAMAGATA_KAMINOYAMA', YamagataMurayama = 'YAMAGATA_MURAYAMA', YamagataNagai = 'YAMAGATA_NAGAI',
    YamagataTendo = 'YAMAGATA_TENDO', YamagataHigashine = 'YAMAGATA_HIGASHINE', YamagataObanazawa = 'YAMAGATA_OBANAZAWA',
    YamagataNanyo = 'YAMAGATA_NANYO',

    // FUKUSHIMA (13 cities)
    FukushimaFukushima = 'FUKUSHIMA_FUKUSHIMA', FukushimaAizuwakamatsu = 'FUKUSHIMA_AIZUWAKAMATSU',
    FukushimaKoriyama = 'FUKUSHIMA_KORIYAMA',
    FukushimaIwaki = 'FUKUSHIMA_IWAKI', FukushimaShirakawa = 'FUKUSHIMA_SHIRAKAWA', FukushimaSukagawa = 'FUKUSHIMA_SUKAGAWA',
    FukushimaKitakata = 'FUKUSHIMA_KITAKATA', FukushimaSoma = 'FUKUSHIMA_SOMA', FukushimaDate = 'FUKUSHIMA_DATE',
    FukushimaMotomiya = 'FUKUSHIMA_MOTOMIYA', FukushimaNihonmatsu = 'FUKUSHIMA_NIHONMATSU',
    FukushimaMinamisoma = 'FUKUSHIMA_MINAMISOMA',
    FukushimaTamura = 'FUKUSHIMA_TAMURA',

    // IBARAKI (32 cities)
    IbarakiMito = 'IBARAKI_MITO', IbarakiHitachi = 'IBARAKI_HITACHI', IbarakiTsuchiura = 'IBARAKI_TSUCHIURA',
    IbarakiKoga = 'IBARAKI_KOGA', IbarakiIshioka = 'IBARAKI_ISHIOKA', IbarakiYuki = 'IBARAKI_YUKI',
    IbarakiRyugasaki = 'IBARAKI_RYUGASAKI', IbarakiShimotsuma = 'IBARAKI_SHIMOTSUMA', IbarakiJoso = 'IBARAKI_JOSO',
    IbarakiHitachiota = 'IBARAKI_HITACHIOTA', IbarakiTakahagi = 'IBARAKI_TAKAHAGI', IbarakiKitaibaraki = 'IBARAKI_KITAIBARAKI',
    IbarakiKasama = 'IBARAKI_KASAMA', IbarakiToride = 'IBARAKI_TORIDE', IbarakiUshiku = 'IBARAKI_USHIKU',
    IbarakiTsukuba = 'IBARAKI_TSUKUBA', IbarakiHitachinaka = 'IBARAKI_HITACHINAKA', IbarakiKashima = 'IBARAKI_KASHIMA',
    IbarakiItako = 'IBARAKI_ITAKO', IbarakiSakuragawa = 'IBARAKI_SAKURAGAWA', IbarakiKamisu = 'IBARAKI_KAMISU',
    IbarakiBando = 'IBARAKI_BANDO', IbarakiInashiki = 'IBARAKI_INASHIKI', IbarakiKasumigaura = 'IBARAKI_KASUMIGAURA',
    IbarakiTsukubamirai = 'IBARAKI_TSUKUBAMIRAI', IbarakiOmitama = 'IBARAKI_OMITAMA',

    // TOCHIGI (14 cities)
    TochigiUtsunomiya = 'TOCHIGI_UTSUNOMIYA', TochigiAshikaga = 'TOCHIGI_ASHIKAGA', TochigiTochigi = 'TOCHIGI_TOCHIGI',
    TochigiSano = 'TOCHIGI_SANO', TochigiKanuma = 'TOCHIGI_KANUMA', TochigiNikko = 'TOCHIGI_NIKKO',
    TochigiOyama = 'TOCHIGI_OYAMA', TochigiMooka = 'TOCHIGI_MOOKA', TochigiOhtawara = 'TOCHIGI_OHTAWARA',
    TochigiYaita = 'TOCHIGI_YAITA', TochigiNasushiobara = 'TOCHIGI_NASUSHIOBARA', TochigiSakura = 'TOCHIGI_SAKURA',
    TochigiNasukarasuyama = 'TOCHIGI_NASUKARASUYAMA', TochigiShimotsuke = 'TOCHIGI_SHIMOTSUKE',

    // GUNMA (12 cities)
    GunmaMaebashi = 'GUNMA_MAEBASHI', GunmaTakasaki = 'GUNMA_TAKASAKI', GunmaKiryu = 'GUNMA_KIRYU',
    GunmaIsesaki = 'GUNMA_ISESAKI', GunmaOta = 'GUNMA_OTA', GunmaNumata = 'GUNMA_NUMATA',
    GunmaTatebayashi = 'GUNMA_TATEBAYASHI', GunmaShibukawa = 'GUNMA_SHIBUKAWA', GunmaFujioka = 'GUNMA_FUJIOKA',
    GunmaTomioka = 'GUNMA_TOMIOKA', GunmaAnnaka = 'GUNMA_ANNAKA', GunmaMidori = 'GUNMA_MIDORI',

    // SAITAMA (40 cities)
    SaitamaSaitama = 'SAITAMA_SAITAMA', SaitamaKawaguchi = 'SAITAMA_KAWAGUCHI', SaitamaKawagoe = 'SAITAMA_KAWAGOE',
    SaitamaKumagaya = 'SAITAMA_KUMAGAYA', SaitamaGyoda = 'SAITAMA_GYODA', SaitamaChichibu = 'SAITAMA_CHICHIBU',
    SaitamaTokorozawa = 'SAITAMA_TOKOROZAWA', SaitamaHanno = 'SAITAMA_HANNO', SaitamaKazo = 'SAITAMA_KAZO',
    SaitamaHonjo = 'SAITAMA_HONJO', SaitamaHigashimatsuyama = 'SAITAMA_HIGASHIMATSUYAMA', SaitamaKasukabe = 'SAITAMA_KASUKABE',
    SaitamaSayama = 'SAITAMA_SAYAMA', SaitamaHanyu = 'SAITAMA_HANYU', SaitamaKonosu = 'SAITAMA_KONOSU',
    SaitamaFukaya = 'SAITAMA_FUKAYA', SaitamaAgeo = 'SAITAMA_AGEO', SaitamaKoshigaya = 'SAITAMA_KOSHIGAYA',
    SaitamaWarabi = 'SAITAMA_WARABI', SaitamaToda = 'SAITAMA_TODA', SaitamaIruma = 'SAITAMA_IRUMA',
    SaitamaAsaka = 'SAITAMA_ASAKA', SaitamaShiki = 'SAITAMA_SHIKI', SaitamaWako = 'SAITAMA_WAKO',
    SaitamaNiiza = 'SAITAMA_NIIZA', SaitamaOkegawa = 'SAITAMA_OKEGAWA', SaitamaKuki = 'SAITAMA_KUKI',
    SaitamaKitamoto = 'SAITAMA_KITAMOTO', SaitamaYashio = 'SAITAMA_YASHIO', SaitamaFujimi = 'SAITAMA_FUJIMI',
    SaitamaMisato = 'SAITAMA_MISATO', SaitamaHasuda = 'SAITAMA_HASUDA', SaitamaSakado = 'SAITAMA_SAKADO',
    SaitamaSatte = 'SAITAMA_SATTE', SaitamaTsurugashima = 'SAITAMA_TSURUGASHIMA', SaitamaHidaka = 'SAITAMA_HIDAKA',
    SaitamaYoshikawa = 'SAITAMA_YOSHIKAWA', SaitamaFujimino = 'SAITAMA_FUJIMINO', SaitamaSouka = 'SAITAMA_SOUKA',

    // CHIBA (37 cities)
    ChibaChiba = 'CHIBA_CHIBA', ChibaChoshi = 'CHIBA_CHOSHI', ChibaIchikawa = 'CHIBA_ICHIKAWA',
    ChibaFunabashi = 'CHIBA_FUNABASHI', ChibaTateyama = 'CHIBA_TATEYAMA', ChibaKisarazu = 'CHIBA_KISARAZU',
    ChibaMatsudo = 'CHIBA_MATSUDO', ChibaNoda = 'CHIBA_NODA', ChibaMobara = 'CHIBA_MOBARA',
    ChibaNarita = 'CHIBA_NARITA', ChibaSakura = 'CHIBA_SAKURA', ChibaTogane = 'CHIBA_TOGANE',
    ChibaAsahi = 'CHIBA_ASAHI', ChibaNarashino = 'CHIBA_NARASHINO', ChibaKashiwa = 'CHIBA_KASHIWA',
    ChibaKatsuura = 'CHIBA_KATSUURA', ChibaIchihara = 'CHIBA_ICHIHARA', ChibaNagareyama = 'CHIBA_NAGAREYAMA',
    ChibaYachiyo = 'CHIBA_YACHIYO', ChibaAbiko = 'CHIBA_ABIKO', ChibaKamogawa = 'CHIBA_KAMOGAWA',
    ChibaKamagaya = 'CHIBA_KAMAGAYA', ChibaKimitsu = 'CHIBA_KIMITSU', ChibaFuttsu = 'CHIBA_FUTTSU',
    ChibaUrayasu = 'CHIBA_URAYASU', ChibaYotsukaido = 'CHIBA_YOTSUKAIDO', ChibaSodegaura = 'CHIBA_SODEGAURA',
    ChibaYachimata = 'CHIBA_YACHIMATA', ChibaInzai = 'CHIBA_INZAI', ChibaShiroi = 'CHIBA_SHIROI',
    ChibaTomisato = 'CHIBA_TOMISATO', ChibaMinamiboso = 'CHIBA_MINAMIBOSO', ChibaSosa = 'CHIBA_SOSA',
    ChibaKatori = 'CHIBA_KATORI', ChibaSanmu = 'CHIBA_SANMU', ChibaIsumi = 'CHIBA_ISUMI',
    ChibaOamishirasato = 'CHIBA_OAMISHIRASATO',

    // TOKYO (62 wards + cities)
    TokyoChiyoda = 'TOKYO_CHIYODA', TokyoChuo = 'TOKYO_CHUO', TokyoMinato = 'TOKYO_MINATO',
    TokyoShinjuku = 'TOKYO_SHINJUKU', TokyoBunkyo = 'TOKYO_BUNKYO', TokyoTaito = 'TOKYO_TAITO',
    TokyoSumida = 'TOKYO_SUMIDA', TokyoKoto = 'TOKYO_KOTO', TokyoShinagawa = 'TOKYO_SHINAGAWA',
    TokyoMeguro = 'TOKYO_MEGURO', TokyoOta = 'TOKYO_OTA', TokyoSetagaya = 'TOKYO_SETAGAYA',
    TokyoShibuya = 'TOKYO_SHIBUYA', TokyoNakano = 'TOKYO_NAKANO', TokyoSuginami = 'TOKYO_SUGINAMI',
    TokyoToshima = 'TOKYO_TOSHIMA', TokyoKita = 'TOKYO_KITA', TokyoArakawa = 'TOKYO_ARAKAWA',
    TokyoItabashi = 'TOKYO_ITABASHI', TokyoNerima = 'TOKYO_NERIMA', TokyoAdachi = 'TOKYO_ADACHI',
    TokyoKatsushika = 'TOKYO_KATSUSHIKA', TokyoEdogawa = 'TOKYO_EDOGAWA', TokyoHachioji = 'TOKYO_HACHIOJI',
    TokyoTachikawa = 'TOKYO_TACHIKAWA', TokyoMusashino = 'TOKYO_MUSASHINO', TokyoMitaka = 'TOKYO_MITAKA',
    TokyoOme = 'TOKYO_OME', TokyoFuchu = 'TOKYO_FUCHU', TokyoAkishima = 'TOKYO_AKISHIMA',
    TokyoChofu = 'TOKYO_CHOFU', TokyoMachida = 'TOKYO_MACHIDA', TokyoKoganei = 'TOKYO_KOGANEI',
    TokyoKodaira = 'TOKYO_KODAIRA', TokyoHino = 'TOKYO_HINO', TokyoHigashimurayama = 'TOKYO_HIGASHIMURAYAMA',
    TokyoKokubunji = 'TOKYO_KOKUBUNJI', TokyoKunitachi = 'TOKYO_KUNITACHI', TokyoFussa = 'TOKYO_FUSSA',
    TokyoKomae = 'TOKYO_KOMAE', TokyoHigashiyamato = 'TOKYO_HIGASHIYAMATO', TokyoKiyose = 'TOKYO_KIYOSE',
    TokyoHigashikurume = 'TOKYO_HIGASHIKURUME', TokyoMusashimurayama = 'TOKYO_MUSASHIMURAYAMA', TokyoTama = 'TOKYO_TAMA',
    TokyoInagi = 'TOKYO_INAGI', TokyoHamura = 'TOKYO_HAMURA', TokyoAkiruno = 'TOKYO_AKIRUNO',
    TokyoNishitokyo = 'TOKYO_NISHITOKYO',

    // KANAGAWA (19 cities)
    KanagawaYokohama = 'KANAGAWA_YOKOHAMA', KanagawaKawasaki = 'KANAGAWA_KAWASAKI', KanagawaSagamihara = 'KANAGAWA_SAGAMIHARA',
    KanagawaYokosuka = 'KANAGAWA_YOKOSUKA', KanagawaFujisawa = 'KANAGAWA_FUJISAWA', KanagawaHiratsuka = 'KANAGAWA_HIRATSUKA',
    KanagawaKamakura = 'KANAGAWA_KAMAKURA', KanagawaChigasaki = 'KANAGAWA_CHIGASAKI', KanagawaAtsugi = 'KANAGAWA_ATSUGI',
    KanagawaYamato = 'KANAGAWA_YAMATO', KanagawaOdawara = 'KANAGAWA_ODAWARA', KanagawaIsehara = 'KANAGAWA_ISEHARA',
    KanagawaEbina = 'KANAGAWA_EBINA', KanagawaZama = 'KANAGAWA_ZAMA', KanagawaZushi = 'KANAGAWA_ZUSHI',
    KanagawaMinamiashigara = 'KANAGAWA_MINAMIASHIGARA', KanagawaHadano = 'KANAGAWA_HADANO',

    // NIIGATA (20 cities)
    NiigataNiigata = 'NIIGATA_NIIGATA', NiigataJoetsu = 'NIIGATA_JOETSU', NiigataKashiwazaki = 'NIIGATA_KASHIWAZAKI',
    NiigataShibata = 'NIIGATA_SHIBATA', NiigataNagaoka = 'NIIGATA_NAGAOKA', NiigataSanjo = 'NIIGATA_SANJO',
    NiigataOjiya = 'NIIGATA_OJIYA', NiigataKamo = 'NIIGATA_KAMO', NiigataTokamachi = 'NIIGATA_TOKAMACHI',
    NiigataMitsuke = 'NIIGATA_MITSUKE', NiigataMurakami = 'NIIGATA_MURAKAMI', NiigataItoigawa = 'NIIGATA_ITOIGAWA',
    NiigataSado = 'NIIGATA_SADO', NiigataUonuma = 'NIIGATA_UONUMA', NiigataMinamiuonuma = 'NIIGATA_MINAMIUONUMA',
    NiigataTsubame = 'NIIGATA_TSUBAME', NiigataMyoko = 'NIIGATA_MYOKO', NiigataGosen = 'NIIGATA_GOSEN',
    NiigataAgano = 'NIIGATA_AGANO', NiigataTainai = 'NIIGATA_TAINAI',

    // TOYAMA (10 cities)
    ToyamaToyama = 'TOYAMA_TOYAMA', ToyamaTakaoka = 'TOYAMA_TAKAOKA', ToyamaUozu = 'TOYAMA_UOZU',
    ToyamaHimi = 'TOYAMA_HIMI', ToyamaNamerikawa = 'TOYAMA_NAMERIKAWA', ToyamaKurobe = 'TOYAMA_KUROBE',
    ToyamaTonami = 'TOYAMA_TONAMI', ToyamaOyabe = 'TOYAMA_OYABE', ToyamaNanto = 'TOYAMA_NANTO',
    ToyamaImizu = 'TOYAMA_IMIZU',

    // ISHIKAWA (11 cities)
    IshikawaKanazawa = 'ISHIKAWA_KANAZAWA', IshikawaNanao = 'ISHIKAWA_NANAO', IshikawaKomatsu = 'ISHIKAWA_KOMATSU',
    IshikawaWajima = 'ISHIKAWA_WAJIMA', IshikawaSuzu = 'ISHIKAWA_SUZU', IshikawaKaga = 'ISHIKAWA_KAGA',
    IshikawaHakui = 'ISHIKAWA_HAKUI', IshikawaKahoku = 'ISHIKAWA_KAHOKU', IshikawaHakusan = 'ISHIKAWA_HAKUSAN',
    IshikawaNomi = 'ISHIKAWA_NOMI', IshikawaNoto = 'ISHIKAWA_NOTO',

    // FUKUI (9 cities)
    FukuiFukui = 'FUKUI_FUKUI', FukuiTsuruga = 'FUKUI_TSURUGA', FukuiObama = 'FUKUI_OBAMA',
    FukuiOno = 'FUKUI_ONO', FukuiKatsuyama = 'FUKUI_KATSUYAMA', FukuiSabae = 'FUKUI_SABAE',
    FukuiAwara = 'FUKUI_AWARA', FukuiEchizen = 'FUKUI_ECHIZEN', FukuiSakai = 'FUKUI_SAKAI',

    // YAMANASHI (13 cities)
    YamanashiKofu = 'YAMANASHI_KOFU', YamanashiFujiyoshida = 'YAMANASHI_FUJIYOSHIDA', YamanashiTsuru = 'YAMANASHI_TSURU',
    YamanashiYamanashi = 'YAMANASHI_YAMANASHI', YamanashiOtsuki = 'YAMANASHI_OTSUKI', YamanashiNirasaki = 'YAMANASHI_NIRASAKI',
    YamanashiMinamiArupusu = 'YAMANASHI_MINAMIARUPUSU', YamanashiHokuto = 'YAMANASHI_HOKUTO', YamanashiKai = 'YAMANASHI_KAI',
    YamanashiFuefuki = 'YAMANASHI_FUEFUKI', YamanashiUenohara = 'YAMANASHI_UENOHARA', YamanashiKoshu = 'YAMANASHI_KOSHU',
    YamanashiChuo = 'YAMANASHI_CHUO',

    // NAGANO (19 cities)
    NaganoNagano = 'NAGANO_NAGANO', NaganoMatsumoto = 'NAGANO_MATSUMOTO', NaganoUeda = 'NAGANO_UEDA',
    NaganoOkaya = 'NAGANO_OKAYA', NaganoIida = 'NAGANO_IIDA', NaganoSuwa = 'NAGANO_SUWA',
    NaganoKomagane = 'NAGANO_KOMAGANE', NaganoIna = 'NAGANO_INA', NaganoKomoro = 'NAGANO_KOMORO',
    NaganoIiyama = 'NAGANO_IIYAMA', NaganoSaku = 'NAGANO_SAKU', NaganoChino = 'NAGANO_CHINO',
    NaganoOmachi = 'NAGANO_OMACHI', NaganoAzumino = 'NAGANO_AZUMINO', NaganoShiojiri = 'NAGANO_SHIOJIRI',
    NaganoTomi = 'NAGANO_TOMI', NaganoNakano = 'NAGANO_NAKANO', NaganoChikuma = 'NAGANO_CHIKUMA',

    // GIFU (21 cities)
    GifuGifu = 'GIFU_GIFU', GifuOgaki = 'GIFU_OGAKI', GifuTakayama = 'GIFU_TAKAYAMA',
    GifuTajimi = 'GIFU_TAJIMI', GifuSeki = 'GIFU_SEKI', GifuNakatsugawa = 'GIFU_NAKATSUGAWA',
    GifuMino = 'GIFU_MINO', GifuMizunami = 'GIFU_MIZUNAMI', GifuHashima = 'GIFU_HASHIMA',
    GifuEna = 'GIFU_ENA', GifuMinokamo = 'GIFU_MINOKAMO', GifuToki = 'GIFU_TOKI',
    GifuKakamigahara = 'GIFU_KAKAMIGAHARA', GifuKani = 'GIFU_KANI', GifuYamagata = 'GIFU_YAMAGATA', GifuMizuho = 'GIFU_MIZUHO',
    GifuHida = 'GIFU_HIDA', GifuMotosu = 'GIFU_MOTOSU', GifuGero = 'GIFU_GERO',
    GifuKaizu = 'GIFU_KAIZU',

    // SHIZUOKA (23 cities)
    ShizuokaShizuoka = 'SHIZUOKA_SHIZUOKA', ShizuokaHamamatsu = 'SHIZUOKA_HAMAMATSU', ShizuokaNumazu = 'SHIZUOKA_NUMAZU',
    ShizuokaAtami = 'SHIZUOKA_ATAMI', ShizuokaMishima = 'SHIZUOKA_MISHIMA', ShizuokaFujinomiya = 'SHIZUOKA_FUJINOMIYA',
    ShizuokaIto = 'SHIZUOKA_ITO', ShizuokaShimada = 'SHIZUOKA_SHIMADA', ShizuokaFuji = 'SHIZUOKA_FUJI',
    ShizuokaYaizu = 'SHIZUOKA_YAIZU', ShizuokaKakegawa = 'SHIZUOKA_KAKEGAWA', ShizuokaFujieda = 'SHIZUOKA_FUJIEDA',
    ShizuokaGotemba = 'SHIZUOKA_GOTEMBA', ShizuokaShimoda = 'SHIZUOKA_SHIMODA', ShizuokaSusono = 'SHIZUOKA_SUSONO',
    ShizuokaKosai = 'SHIZUOKA_KOSAI', ShizuokaIzu = 'SHIZUOKA_IZU', ShizuokaOmaezaki = 'SHIZUOKA_OMAEZAKI',
    ShizuokaKikugawa = 'SHIZUOKA_KIKUGAWA', ShizuokaIzunokuni = 'SHIZUOKA_IZUNOKUNI', ShizuokaMakinohara = 'SHIZUOKA_MAKINOHARA',

    // AICHI (38 cities)
    AichiNagoya = 'AICHI_NAGOYA', AichiToyohashi = 'AICHI_TOYOHASHI', AichiOkazaki = 'AICHI_OKAZAKI',
    AichiIchinomiya = 'AICHI_ICHINOMIYA', AichiSeto = 'AICHI_SETO', AichiHanda = 'AICHI_HANDA',
    AichiKasugai = 'AICHI_KASUGAI', AichiToyokawa = 'AICHI_TOYOKAWA', AichiTsushima = 'AICHI_TSUSHIMA',
    AichiHekinan = 'AICHI_HEKINAN', AichiKariya = 'AICHI_KARIYA', AichiToyota = 'AICHI_TOYOTA',
    AichiAnjo = 'AICHI_ANJO', AichiNishio = 'AICHI_NISHIO', AichiGamagori = 'AICHI_GAMAGORI',
    AichiInuyama = 'AICHI_INUYAMA', AichiTokoname = 'AICHI_TOKONAME', AichiKonan = 'AICHI_KONAN',
    AichiKomaki = 'AICHI_KOMAKI', AichiInazawa = 'AICHI_INAZAWA', AichiOwariasahi = 'AICHI_OWARIASAHI',
    AichiTakahama = 'AICHI_TAKAHAMA', AichiIwakura = 'AICHI_IWAKURA', AichiToyoake = 'AICHI_TOYOAKE',
    AichiNisshin = 'AICHI_NISSHIN', AichiTahara = 'AICHI_TAHARA', AichiAisai = 'AICHI_AISAI',
    AichiKiyosu = 'AICHI_KIYOSU', AichiKitanagoya = 'AICHI_KITANAGOYA', AichiYatomi = 'AICHI_YATOMI',
    AichiMiyoshi = 'AICHI_MIYOSHI', AichiAma = 'AICHI_AMA', AichiNagakute = 'AICHI_NAGAKUTE',

    // MIE (14 cities)
    MieTsu = 'MIE_TSU', MieYokkaichi = 'MIE_YOKKAICHI', MieIse = 'MIE_ISE',
    MieMatsusaka = 'MIE_MATSUSAKA', MieKuwana = 'MIE_KUWANA', MieSuzuka = 'MIE_SUZUKA',
    MieNabari = 'MIE_NABARI', MieOwase = 'MIE_OWASE', MieKameyama = 'MIE_KAMEYAMA',
    MieToba = 'MIE_TOBA', MieKumano = 'MIE_KUMANO', MieInabe = 'MIE_INABE',
    MieShima = 'MIE_SHIMA', MieIga = 'MIE_IGA',

    // SHIGA (13 cities)
    ShigaOtsu = 'SHIGA_OTSU', ShigaHikone = 'SHIGA_HIKONE', ShigaNagahama = 'SHIGA_NAGAHAMA',
    ShigaOmihachiman = 'SHIGA_OMIHACHIMAN', ShigaKusatsu = 'SHIGA_KUSATSU', ShigaMoriyama = 'SHIGA_MORIYAMA',
    ShigaRitto = 'SHIGA_RITTO', ShigaKoka = 'SHIGA_KOKA', ShigaYasu = 'SHIGA_YASU',
    ShigaKonan = 'SHIGA_KONAN', ShigaTakashima = 'SHIGA_TAKASHIMA', ShigaHigashiomi = 'SHIGA_HIGASHIOMI',
    ShigaMaibara = 'SHIGA_MAIBARA',

    // KYOTO (15 cities)
    KyotoKyoto = 'KYOTO_KYOTO', KyotoFukuchiyama = 'KYOTO_FUKUCHIYAMA', KyotoMaizuru = 'KYOTO_MAIZURU',
    KyotoAyabe = 'KYOTO_AYABE', KyotoUji = 'KYOTO_UJI', KyotoMiyazu = 'KYOTO_MIYAZU',
    KyotoKameoka = 'KYOTO_KAMEOKA', KyotoJoyo = 'KYOTO_JOYO', KyotoMuko = 'KYOTO_MUKO',
    KyotoNagaokakyo = 'KYOTO_NAGAOKAKYO', KyotoYawata = 'KYOTO_YAWATA', KyotoKyotanabe = 'KYOTO_KYOTANABE',
    KyotoKyotango = 'KYOTO_KYOTANGO', KyotoNantan = 'KYOTO_NANTAN', KyotoKizugawa = 'KYOTO_KIZUGAWA',

    // OSAKA (33 cities)
    OsakaOsaka = 'OSAKA_OSAKA', OsakaSakai = 'OSAKA_SAKAI', OsakaToyonaka = 'OSAKA_TOYONAKA',
    OsakaIkeda = 'OSAKA_IKEDA', OsakaSuita = 'OSAKA_SUITA', OsakaTakatsuki = 'OSAKA_TAKATSUKI',
    OsakaKaizuka = 'OSAKA_KAIZUKA', OsakaMoriguchi = 'OSAKA_MORIGUCHI', OsakaHirakata = 'OSAKA_HIRAKATA',
    OsakaIbaraki = 'OSAKA_IBARAKI', OsakaYao = 'OSAKA_YAO', OsakaIzumisano = 'OSAKA_IZUMISANO',
    OsakaTondabayashi = 'OSAKA_TONDABAYASHI', OsakaNeyagawa = 'OSAKA_NEYAGAWA', OsakaKawachinagano = 'OSAKA_KAWACHINAGANO',
    OsakaMatsubara = 'OSAKA_MATSUBARA', OsakaDaito = 'OSAKA_DAITO', OsakaIzumi = 'OSAKA_IZUMI',
    OsakaMinoh = 'OSAKA_MINOH', OsakaKashiwara = 'OSAKA_KASHIWARA', OsakaHabikino = 'OSAKA_HABIKINO',
    OsakaKadoma = 'OSAKA_KADOMA', OsakaSettsu = 'OSAKA_SETTSU', OsakaTakaishi = 'OSAKA_TAKAISHI',
    OsakaFujiidera = 'OSAKA_FUJIIDERA', OsakaHigashiosaka = 'OSAKA_HIGASHIOSAKA', OsakaSennan = 'OSAKA_SENNAN',
    OsakaShijonawate = 'OSAKA_SHIJONAWATE', OsakaKatano = 'OSAKA_KATANO', OsakaOsakasayama = 'OSAKA_OSAKASAYAMA',
    OsakaHannan = 'OSAKA_HANNAN',

    // HYOGO (29 cities)
    HyogoKobe = 'HYOGO_KOBE', HyogoHimeji = 'HYOGO_HIMEJI', HyogoAmagasaki = 'HYOGO_AMAGASAKI',
    HyogoAkashi = 'HYOGO_AKASHI', HyogoNishinomiya = 'HYOGO_NISHINOMIYA', HyogoSumoto = 'HYOGO_SUMOTO',
    HyogoAshiya = 'HYOGO_ASHIYA', HyogoItami = 'HYOGO_ITAMI', HyogoAioi = 'HYOGO_AIOI',
    HyogoToyooka = 'HYOGO_TOYOOKA', HyogoKakogawa = 'HYOGO_KAKOGAWA', HyogoAko = 'HYOGO_AKO',
    HyogoNishiwaki = 'HYOGO_NISHIWAKI', HyogoTakarazuka = 'HYOGO_TAKARAZUKA', HyogoMiki = 'HYOGO_MIKI',
    HyogoTakasago = 'HYOGO_TAKASAGO', HyogoKawanishi = 'HYOGO_KAWANISHI', HyogoOno = 'HYOGO_ONO',
    HyogoSanda = 'HYOGO_SANDA', HyogoKasai = 'HYOGO_KASAI', HyogoSasayama = 'HYOGO_SASAYAMA',
    HyogoYabu = 'HYOGO_YABU', HyogoTamba = 'HYOGO_TAMBA', HyogoMinami = 'HYOGO_MINAMI',
    HyogoAwaji = 'HYOGO_AWAJI', HyogoShiso = 'HYOGO_SHISO', HyogoKato = 'HYOGO_KATO',
    HyogoTatsuno = 'HYOGO_TATSUNO',

    // NARA (12 cities)
    NaraNara = 'NARA_NARA', NaraYamatokoriyama = 'NARA_YAMATOKORIYAMA', NaraYamatotakada = 'NARA_YAMATOTAKADA',
    NaraKashihara = 'NARA_KASHIHARA', NaraSakurai = 'NARA_SAKURAI', NaraGojo = 'NARA_GOJO',
    NaraGose = 'NARA_GOSE', NaraIkoma = 'NARA_IKOMA', NaraKashiba = 'NARA_KASHIBA',
    NaraKatsuragi = 'NARA_KATSURAGI', NaraUda = 'NARA_UDA', NaraTenri = 'NARA_TENRI',

    // WAKAYAMA (9 cities)
    WakayamaWakayama = 'WAKAYAMA_WAKAYAMA', WakayamaKainan = 'WAKAYAMA_KAINAN', WakayamaHashimoto = 'WAKAYAMA_HASHIMOTO',
    WakayamaArida = 'WAKAYAMA_ARIDA', WakayamaGobo = 'WAKAYAMA_GOBO', WakayamaTanabe = 'WAKAYAMA_TANABE',
    WakayamaShingu = 'WAKAYAMA_SHINGU', WakayamaKinokawa = 'WAKAYAMA_KINOKAWA', WakayamaIwade = 'WAKAYAMA_IWADE',

    // TOTTORI (4 cities)
    TottoriTottori = 'TOTTORI_TOTTORI', TottoriYonago = 'TOTTORI_YONAGO', TottoriKurayoshi = 'TOTTORI_KURAYOSHI',
    TottoriBoundary = 'TOTTORI_BOUNDARY',

    // SHIMANE (8 cities)
    ShimaneMatsue = 'SHIMANE_MATSUE', ShimaneHamada = 'SHIMANE_HAMADA', ShimaneIzumo = 'SHIMANE_IZUMO',
    ShimaneMasuda = 'SHIMANE_MASUDA', ShimaneOda = 'SHIMANE_ODA', ShimaneYasugi = 'SHIMANE_YASUGI',
    ShimaneGotsu = 'SHIMANE_GOTSU', ShimaneUnnan = 'SHIMANE_UNNAN',

    // OKAYAMA (15 cities)
    OkayamaOkayama = 'OKAYAMA_OKAYAMA', OkayamaKurashiki = 'OKAYAMA_KURASHIKI', OkayamaTsuyama = 'OKAYAMA_TSUYAMA',
    OkayamaTamano = 'OKAYAMA_TAMANO', OkayamaKasaoka = 'OKAYAMA_KASAOKA', OkayamaIbara = 'OKAYAMA_IBARA',
    OkayamaSoja = 'OKAYAMA_SOJA', OkayamaTakahashi = 'OKAYAMA_TAKAHASHI', OkayamaNiimi = 'OKAYAMA_NIIMI',
    OkayamaBizen = 'OKAYAMA_BIZEN', OkayamaSetouchi = 'OKAYAMA_SETOUCHI', OkayamaAkaiwa = 'OKAYAMA_AKAIWA',
    OkayamaManiwa = 'OKAYAMA_MANIWA', OkayamaMimasaka = 'OKAYAMA_MIMASAKA', OkayamaAsakuchi = 'OKAYAMA_ASAKUCHI',

    // HIROSHIMA (14 cities)
    HiroshimaHiroshima = 'HIROSHIMA_HIROSHIMA', HiroshimaKure = 'HIROSHIMA_KURE', HiroshimaTakehara = 'HIROSHIMA_TAKEHARA',
    HiroshimaMihara = 'HIROSHIMA_MIHARA', HiroshimaOnoichi = 'HIROSHIMA_ONOICHI', HiroshimaFukuyama = 'HIROSHIMA_FUKUYAMA',
    HiroshimaFuchu = 'HIROSHIMA_FUCHU', HiroshimaMiyoshi = 'HIROSHIMA_MIYOSHI', HiroshimaShobara = 'HIROSHIMA_SHOBARA',
    HiroshimaOtake = 'HIROSHIMA_OTAKE', HiroshimaHigashihiroshima = 'HIROSHIMA_HIGASHIHIROSHIMA',
    HiroshimaHatsukaichi = 'HIROSHIMA_HATSUKAICHI',
    HiroshimaAkitakata = 'HIROSHIMA_AKITAKATA', HiroshimaEtajima = 'HIROSHIMA_ETAJIMA',

    // YAMAGUCHI (13 cities)
    YamaguchiShimonoseki = 'YAMAGUCHI_SHIMONOSEKI', YamaguchiUbe = 'YAMAGUCHI_UBE', YamaguchiYamaguchi = 'YAMAGUCHI_YAMAGUCHI',
    YamaguchiHagi = 'YAMAGUCHI_HAGI', YamaguchiHofu = 'YAMAGUCHI_HOFU', YamaguchiKudamatsu = 'YAMAGUCHI_KUDAMATSU',
    YamaguchiIwakuni = 'YAMAGUCHI_IWAKUNI', YamaguchiHikari = 'YAMAGUCHI_HIKARI', YamaguchiNagato = 'YAMAGUCHI_NAGATO',
    YamaguchiYanai = 'YAMAGUCHI_YANAI', YamaguchiMine = 'YAMAGUCHI_MINE', YamaguchiShuto = 'YAMAGUCHI_SHUTO',
    YamaguchiSanyo = 'YAMAGUCHI_SANYO',

    // TOKUSHIMA (8 cities)
    TokushimaTokushima = 'TOKUSHIMA_TOKUSHIMA', TokushimaNaruto = 'TOKUSHIMA_NARUTO',
    TokushimaKomatsushima = 'TOKUSHIMA_KOMATSUSHIMA',
    TokushimaAnan = 'TOKUSHIMA_ANAN', TokushimaYoshinogawa = 'TOKUSHIMA_YOSHINOGAWA', TokushimaAwa = 'TOKUSHIMA_AWA',
    TokushimaMima = 'TOKUSHIMA_MIMA', TokushimaMiyoshi = 'TOKUSHIMA_MIYOSHI',

    // KAGAWA (8 cities)
    KagawaTakamatsu = 'KAGAWA_TAKAMATSU', KagawaMarugame = 'KAGAWA_MARUGAME', KagawaSakaide = 'KAGAWA_SAKAIDE',
    KagawaZentuji = 'KAGAWA_ZENTUJI', KagawaKanonji = 'KAGAWA_KANONJI', KagawaSanuki = 'KAGAWA_SANUKI',
    KagawaHigashikagawa = 'KAGAWA_HIGASHIKAGAWA', KagawaMitoyo = 'KAGAWA_MITOYO',

    // EHIME (11 cities)
    EhimeMatsuyama = 'EHIME_MATSUYAMA', EhimeImabari = 'EHIME_IMABARI', EhimeUwajima = 'EHIME_UWAJIMA',
    EhimeYawatahama = 'EHIME_YAWATAHAMA', EhimeNiihama = 'EHIME_NIIHAMA', EhimeSaijo = 'EHIME_SAIJO',
    EhimeOzu = 'EHIME_OZU', EhimeIyo = 'EHIME_IYO', EhimeSeiyo = 'EHIME_SEIYO',
    EhimeToon = 'EHIME_TOON', EhimeShikokuchuo = 'EHIME_SHIKOKUCHUO',

    // KOCHI (11 cities)
    KochiKochi = 'KOCHI_KOCHI', KochiMuroto = 'KOCHI_MUROTO', KochiAki = 'KOCHI_AKI',
    KochiNankoku = 'KOCHI_NANKOKU', KochiTosa = 'KOCHI_TOSA', KochiSusaki = 'KOCHI_SUSAKI',
    KochiSukumo = 'KOCHI_SUKUMO', KochiTosashimizu = 'KOCHI_TOSASHIMIZU', KochiShimanto = 'KOCHI_SHIMANTO',
    KochiKonan = 'KOCHI_KONAN', KochiKami = 'KOCHI_KAMI',

    // FUKUOKA (29 cities)
    FukuokaFukuoka = 'FUKUOKA_FUKUOKA', FukuokaKitakyushu = 'FUKUOKA_KITAKYUSHU', FukuokaOmuta = 'FUKUOKA_OMUTA',
    FukuokaKurume = 'FUKUOKA_KURUME', FukuokaNogata = 'FUKUOKA_NOGATA', FukuokaIizuka = 'FUKUOKA_IIZUKA',
    FukuokaTagawa = 'FUKUOKA_TAGAWA', FukuokaYanagawa = 'FUKUOKA_YANAGAWA', FukuokaYame = 'FUKUOKA_YAME',
    FukuokaChikugo = 'FUKUOKA_CHIKUGO', FukuokaOkawa = 'FUKUOKA_OKAWA', FukuokaBuzen = 'FUKUOKA_BUZEN',
    FukuokaNakagawa = 'FUKUOKA_NAKAGAWA', FukuokaOgori = 'FUKUOKA_OGORI', FukuokaChikushino = 'FUKUOKA_CHIKUSHINO',
    FukuokaKasuga = 'FUKUOKA_KASUGA', FukuokaOnojo = 'FUKUOKA_ONOJO', FukuokaMunakata = 'FUKUOKA_MUNAKATA',
    FukuokaDazaifu = 'FUKUOKA_DAZAIFU', FukuokaKoga = 'FUKUOKA_KOGA', FukuokaFukutsu = 'FUKUOKA_FUKUTSU',
    FukuokaUkiha = 'FUKUOKA_UKIHA', FukuokaMiyawaka = 'FUKUOKA_MIYAWAKA', FukuokaKama = 'FUKUOKA_KAMA',
    FukuokaAsakura = 'FUKUOKA_ASAKURA', FukuokaMiyama = 'FUKUOKA_MIYAMA', FukuokaItoshima = 'FUKUOKA_ITOSHIMA',

    // SAGA (10 cities)
    SagaSaga = 'SAGA_SAGA', SagaKaratsu = 'SAGA_KARATSU', SagaTosu = 'SAGA_TOSU',
    SagaTaku = 'SAGA_TAKU', SagaImari = 'SAGA_IMARI', SagaKashima = 'SAGA_KASHIMA',
    SagaOgi = 'SAGA_OGI', SagaUreshino = 'SAGA_URESHINO', SagaKanzaki = 'SAGA_KANZAKI',

    // NAGASAKI (13 cities)
    NagasakiNagasaki = 'NAGASAKI_NAGASAKI', NagasakiSasebo = 'NAGASAKI_SASEBO', NagasakiShimabara = 'NAGASAKI_SHIMABARA',
    NagasakiIsahaya = 'NAGASAKI_ISAHAYA', NagasakiOmura = 'NAGASAKI_OMURA', NagasakiHirado = 'NAGASAKI_HIRADO',
    NagasakiMatsuura = 'NAGASAKI_MATSUURA', NagasakiTsushima = 'NAGASAKI_TSUSHIMA', NagasakiIki = 'NAGASAKI_IKI',
    NagasakiGoto = 'NAGASAKI_GOTO', NagasakiSaikai = 'NAGASAKI_SAIKAI', NagasakiUnzen = 'NAGASAKI_UNZEN',
    NagasakiMinamishimabara = 'NAGASAKI_MINAMISHIMABARA',

    // KUMAMOTO (14 cities)
    KumamotoKumamoto = 'KUMAMOTO_KUMAMOTO', KumamotoYatsushiro = 'KUMAMOTO_YATSUSHIRO', KumamotoHitoyoshi = 'KUMAMOTO_HITOYOSHI',
    KumamotoArao = 'KUMAMOTO_ARAO', KumamotoTamana = 'KUMAMOTO_TAMANA', KumamotoAmakusa = 'KUMAMOTO_AMAKUSA',
    KumamotoYamaga = 'KUMAMOTO_YAMAGA', KumamotoKikuchi = 'KUMAMOTO_KIKUCHI', KumamotoUto = 'KUMAMOTO_UTO',
    KumamotoKamiamakusa = 'KUMAMOTO_KAMIAMAKUSA', KumamotoUki = 'KUMAMOTO_UKI', KumamotoAsagiri = 'KUMAMOTO_ASAGIRI',
    KumamotoKosa = 'KUMAMOTO_KOSA',

    // OITA (14 cities)
    OitaOita = 'OITA_OITA', OitaBeppu = 'OITA_BEPPU', OitaNakatsu = 'OITA_NAKATSU',
    OitaHita = 'OITA_HITA', OitaSaiki = 'OITA_SAIKI', OitaUsuki = 'OITA_USUKI',
    OitaTsukumi = 'OITA_TSUKUMI', OitaTaketa = 'OITA_TAKETA', OitaBungotakada = 'OITA_BUNGOTAKADA',
    OitaKitsuki = 'OITA_KITSUKI', OitaUsa = 'OITA_USA', OitaBungoono = 'OITA_BUNGOONO',
    OitaYufu = 'OITA_YUFU', OitaKunisaki = 'OITA_KUNISAKI',

    // MIYAZAKI (9 cities)
    MiyazakiMiyazaki = 'MIYAZAKI_MIYAZAKI', MiyazakiMiyakonojo = 'MIYAZAKI_MIYAKONOJO', MiyazakiNobeoka = 'MIYAZAKI_NOBEOKA',
    MiyazakiNichinan = 'MIYAZAKI_NICHINAN', MiyazakiKobayashi = 'MIYAZAKI_KOBAYASHI', MiyazakiHyuga = 'MIYAZAKI_HYUGA',
    MiyazakiKushima = 'MIYAZAKI_KUSHIMA', MiyazakiSaito = 'MIYAZAKI_SAITO', MiyazakiEbino = 'MIYAZAKI_EBINO',

    // KAGOSHIMA (19 cities)
    KagoshimaKagoshima = 'KAGOSHIMA_KAGOSHIMA', KagoshimaKanoya = 'KAGOSHIMA_KANOYA',
    KagoshimaMakurazaki = 'KAGOSHIMA_MAKURAZAKI',
    KagoshimaAkune = 'KAGOSHIMA_AKUNE', KagoshimaIzumi = 'KAGOSHIMA_IZUMI', KagoshimaIbusuki = 'KAGOSHIMA_IBUSUKI',
    KagoshimaMinamikyu = 'KAGOSHIMA_MINAMIKYU', KagoshimaSoo = 'KAGOSHIMA_SOO', KagoshimaKirishima = 'KAGOSHIMA_KIRISHIMA',
    KagoshimaIchikikushikino = 'KAGOSHIMA_ICHIKIKUSHIKINO', KagoshimaSatsumasendai = 'KAGOSHIMA_SATSUMASENDAI',
    KagoshimaHioki = 'KAGOSHIMA_HIOKI',
    KagoshimaNishinoomote = 'KAGOSHIMA_NISHINOOMOTE', KagoshimaTarumizu = 'KAGOSHIMA_TARUMIZU',
    KagoshimaSatsuma = 'KAGOSHIMA_SATSUMA',
    KagoshimaAmami = 'KAGOSHIMA_AMAMI', KagoshimaMinamikyushu = 'KAGOSHIMA_MINAMIKYUSHU', KagoshimaShiiba = 'KAGOSHIMA_SHIIBA',
    KagoshimaAira = 'KAGOSHIMA_AIRA',

    // OKINAWA (11 cities)
    OkinawaNaha = 'OKINAWA_NAHA', OkinawaGinowan = 'OKINAWA_GINOWAN', OkinawaIshigaki = 'OKINAWA_ISHIGAKI',
    OkinawaUrasoe = 'OKINAWA_URASOE', OkinawaItoman = 'OKINAWA_ITOMAN', OkinawaOkinawa = 'OKINAWA_OKINAWA',
    OkinawaTomigusuku = 'OKINAWA_TOMIGUSUKU', OkinawaUruma = 'OKINAWA_URUMA', OkinawaMiyakojima = 'OKINAWA_MIYAKOJIMA',
    OkinawaNanjo = 'OKINAWA_NANJO', OkinawaNago = 'OKINAWA_NAGO'
}
