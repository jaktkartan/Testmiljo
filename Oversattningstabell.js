// Oversattningstabell.js

//Dölj all data i popupfönstrena med följande fältnamn
var hideProperties = ['id', 'shape_leng', 'objectid_2', 'objectid', 'shape_area', 'shape_le_2', 'field', 'omrade'];
// Dölj fältnamn visa bara innehåll
var hideNameOnlyProperties = ['namn', 'bild', 'info', 'link'];

// Översättningstabell i popup-panelerna
var translationTable = {
    // Allmän jakt: Däggdjur
    // Bäver
    "baver1_all": "Jakt",
    "baver2_all": "Jakttid",
    "baver3_til": "Jakt under dygnet",
    "baver4_kul": "Kulvapen",
    "baver5_hag": "Hagelvapen",
    
    // Dovvilt
    "dov7_hind_": "Jaktperiod 1",
    "dov8_hind_": "Jakttid",
    "dov9_hornb": "Jaktperiod 2",
    "dov91_horn": "Jakttid",
    "dov1_alla_": "Jaktperiod 3",
    "dov2_alla_": "Jakttid",
    "dov5_hind_": "Jaktperiod 4",
    "dov6_hind_": "Jakttid",
    "dov3_alla_": "Jaktperiod 5",
    "dov4_alla_": "Jakttid",
    "dov92_till": "Jakt under dygnet",
    "dov93_kulv": "Kulvapen",
    "dov94_hage": "Hagelvapen",
    
    // Fälthare
    "falthare1_": "Jakt",
    "falthare2_": "Jakttid",
    "falthare3_": "Jakt under dygnet",
    "falthare4_": "Kulvapen",
    "falthare5_": "Hagelvapen",
    
    // Grävling
    "gravling1_": "Jakt",
    "gravling2_": "Jakttid",
    "gravling3_": "Jakt under dygnet",
    "gravling4_": "Kulvapen",
    "gravling5_": "Hagelvapen",
    
    // Iller
    "iller1_all": "jakt",
    "iller2_all": "Jakttid",
    "iller3_til": "Jakt under dygnet",
    "iller4_kul": "Kulvapen",
    "iller5_hag": "Hagelvapen",
    
    // Kronvilt
    "kronh5_sko": "Jaktperiod 1",
    "kronh6_sko": "Jakttid",
    "kron_skå1": "Jaktperiod endast Skåne",
    "kron_skå2": "Jakttid",
    "kronh7_ore": "Jaktperiod 2",
    "kronh8_ore": "Jakttid",
    "kronh1_sko": "Jaktperiod 3",
    "kronh2_sko": "Jakttid",
    "kronh3_sko": "Jaktperiod 4",
    "kronh4_sko": "Jakttid",
    "kronh9_kal": "Jaktperiod 5",
    "kronh91_ka": "Jakttid",
    "kronh92_ti": "Jakt under dygnet",
    "kronh93_ku": "Kulvapen",
    "kronh94_ha": "Hagelvapen",
    
    // Rådjur
    "radjur3_ho": "Jaktperiod 1",
    "radjur4_ho": "Jakttid",
    "radjur5_ho": "Jaktperiod 2",
    "radjur6_ho": "Jakttid",
    "radjur7_ki": "Jaktperiod 3",
    "radjur8_ki": "Jakttid",
    "radjur1_al": "Jaktperiod 4",
    "radjur2_al": "Jakttid",
    "radjur9_ti": "Jakt under dygnet",
    "radjur91_k": "Kulvapen",
    "radjur92_h": "Hagelvapen",
    
    // Rödräv
    "rodrav1_al": "Jakt",
    "rodrav2_al": "Jakttid",
    "rodrav3_ti": "Jakt under dygnet",
    "rodrav4_ku": "Kulvapen",
    "rodrav5_ha": "Hagelvapen",
    
    // Skogshare
    "skogshare1": "Jakt",
    "skogshare2": "Jakttid",
    "skogshare3": "Jakt under dygnet",
    "skogshare4": "Kulvapen",
    "skogshare5": "Hagelvapen",
    
    // Skogsmård
    "skogsmard1": "Jakt",
    "skogsmard2": "Jakttid",
    "skogsmard3": "Jakt under dygnet",
    "skogsmard4": "Kulvapen",
    "skogsmard5": "Hagelvapen",
    
    // Vildsvin
    "vildsvin1_": "Jaktperiod 1",
    "vildsvin2_": "Jakttid",
    "vildsvin3_": "Jaktperiod 2",
    "vildsvin4_": "Jakttid",
    "vildsvin5_": "Jakt under dygnet",
    "vildsvin6_": "Kulvapen",
    "vildsvin7_": "Hagelvapen",
    
    // Älg
    "xalg1": "Jakt",
    "xalg2_datu": "Info",
    "xalg3_till": "Jakt under dygnet",
    "xalg4_kulv": "Kulvapen",
    "xalg5_hage": "Hagelvapen",

    //Allmän jakt: Fågel
    
    "lan_namn": "LÄN",

    // Bläsand
    "blasand__1": "Bläsand",
    "blasand_aj": "Jakttid",
    "blasand_kl": "Jakt under dygnet",
    "blasand_ka": "Kaliberkrav",

    // Bläsgås
    "blasgas__1": "Bläsgås",
    "blasgas_aj": "Jakttid",
    "blasgas_kl": "Jakt under dygnet",
    "blasgas_ka": "Kaliberkrav",

    // Dalripa
    "dalripa__1": "Dalripa",
    "dalripa_aj": "Jakttid",
    "dalripa_kl": "Jakt under dygnet",
    "dalripa_ka": "Kaliberkrav",

    //Fasan
    "fasan_ajt": "Fasan",
    "fasan_ajf": "Jakttid",
    "fasan_kloc": "Jakt under dygnet",
    "fasan_kali": "Kaliberkrav",

    //Fiskmås
    "fiskmas__1": "Fiskmås",
    "fiskmas_aj": "Jakttid",
    "fiskmas_kl": "Jakt under dygnet",
    "fiskmas_ka": "Kaliberkrav",

    //Fjällripa
    "fjallripa1": "Fjällripa",
    "fjallripa_": "Jakttid",
    "fjallrip_1": "Jakt under dygnet",
    "fjallrip_2": "Kaliberkrav",

    //Grågås
    "gragas_ajt": "Grågås",
    "gragas_ajf": "Jakttid",
    "gragas_klo": "Jakt under dygnet",
    "gragas_kal": "Kaliberkrav",

    //Gråtrut
    "gratrut__1": "Gråtrut",
    "gratrut_aj": "Jakttid",
    "gratrut_kl": "Jakt under dygnet",
    "gratrut_ka": "Kaliberkrav",

    //Gräsand
    "grasand__1": "Gräsand",
    "grasand_aj": "Jakttid",
    "grasand_kl": "Jakt under dygnet",
    "grasand_ka": "Kaliberkrav",

    //Järpe
    "jarpe_info": "Järpe",
    "jarpe_ajf": "Jakttid",
    "jarpe_kloc": "Jakt under dygnet",
    "jarpe_kali": "Kaliberkrav",

    //Kaja
    "kaja_ajt": "Kaja",
    "kaja_ajf": "Jakttid",
    "kaja_klock": "Jakt under dygnet",
    "kaja_kalib": "Kaliberkrav",

    //Kanadagås
    "kanadagas1": "Kanadagås",
    "kanadagas_": "Jakttid",
    "kanadaga_1": "Jakt under dygnet",
    "kanadaga_2": "Kaliberkrav",

    //Knipa
    "knipa_ajt": "Knipa",
    "knipa_ajf": "Jakttid",
    "knipa_kloc": "Jakt under dygnet",
    "knipa_kali": "Kaliberkrav",

    //Kricka
    "kricka_ajt": "Kricka",
    "kricka_ajf": "Jakttid",
    "kricka_klo": "Jakt under dygnet",
    "kricka_kal": "Kaliberkrav",

    //Kråka
    "kraka_ajt": "Krake",
    "kraka_ajf": "Jakttid",
    "kraka_kloc": "Jakt under dygnet",
    "kraka_kali": "Kaliberkrav",

    //Morkulla
    "morkulla_1": "Morkulla",
    "morkulla_a": "Jakttid",
    "morkulla_k": "Jakt under dygnet",
    "morkulla_2": "Kaliberkrav",

    //Nötskrika
    "notskrika1": "Nötskrika",
    "notskrika_": "Jakttid",
    "notskrik_1": "Jakt under dygnet",
    "notskrik_2": "Kaliberkrav",

    //Orre
    "orre_ajt": "Orre",
    "orre_ajf": "Jakttid",
    "orre_klock": "Jakt under dygnet",
    "orre_kalib": "Kaliberkrav",

    //Orrtupp
    "orrtupp_in": "Orre Tupp",
    "orrtupp_aj": "Jakttid",
    "orrtupp_kl": "Jakt under dygnet",
    "orrtupp_ka": "Kaliberkrav",

    //Rapphöna
    "rapphona_1": "Rapphöna",
    "rapphona_a": "Jakttid",
    "rapphona_k": "Jakt under dygnet",
    "rapphona_2": "Kaliberkrav",

    //Ringduva
    "ringduva_1": "Ringduva",
    "ringduva_a": "Jakttid",
    "ringduva_k": "Jakt under dygnet",
    "ringduva_2": "Kaliberkrav",

    //Råka
    "raka_info": "Råka",
    "raka_ajf": "Jakttid",
    "raka_klock": "Jakt under dygnet",
    "raka_kalib": "Kaliberkrav",

    //Sjöorre
    "sjoorre__1": "Sjörre",
    "sjoorre_aj": "Jakttid",
    "sjoorre_kl": "Jakt under dygnet",
    "sjoorre_ka": "Kaliberkrav",

    //Skata
    "skata_ajt": "Skata",
    "skata_ajf": "Jakttid",
    "skata_kloc": "Jakt under dygnet",
    "skata_kali": "Kaliberkrav",

    //Storskrake
    "storkrake1": "Storskrake",
    "storkrake_": "Jakttid",
    "storkrak_1": "Jakt under dygnet",
    "storkrak_2": "Kaliberkrav",

    //Tjäder
    "tjader_ajt": "Tjäder",
    "tjader_ajf": "Jakttid",
    "tjader_klo": "Jakt under dygnet",
    "tjader_kal": "Kaliberkrav",

    //Tjädertupp
    "tjadertu_1": "Tjädertupp",
    "tjadertupp": "Jakttid",
    "tjadertu_2": "Jakt under dygnet",
    "tjadertu_3": "Kaliberkrav",

    //Trana
    "trana_ajt": "Trana",
    "trana_ajf": "Jakttid",
    "trana_klock": "Jakt under dygnet",
    "trana_kalib": "Kaliberkrav",

    //Vigg
    "vigg_info": "Vigg",
    "vigg_ajf": "Jakttid",
    "vigg_klock": "Jakt under dygnet",
    "vigg_kalib": "Kaliberkrav",

    //Vitkindad gås
    "vitkindad1": "Vitkindad gås",
    "vitkindad_": "Jakttid",
    "vitkinda_1": "Jakt under dygnet",
    "vitkinda_2": "Kaliberkrav",

    //Gränsälvsområdet till finnland:
    "blasand_no": "Bläsand",
    //"blasand__1": "Jakttid", måste byta fältnamn, samma som för bläsand i den andra geojsonfilen.
    "GRAGAS": "Grågås",
    "GRAGAS_JAK": "Jakttid",
    "grasand_no": "Gräsand",
    //"grasand__1": "Jakttid", måste byta fältnamn, samma som för bläsand i den andra geojsonfilen.
    "KANADAGÅS": "Kanadagås",
    "KAN_GAS_JA": "Jakttid",
    "KNIPA": "Knipa",
    "KNIPA_JAKT": "Jakttid",
    "kricka_nor": "Kricka",
    "kricka_n_1": "Jakttid",
    "STORKRAKE": "Storskrake",
    "STORK_JAKT": "Jakttid",
    "VIGG": "Vigg",
    "VIGG_JAKTT": "Jakttid",
    "gransalvso": "Gränsälvsområdet till Finland",

    //Älgjaktskartan
    "jakttid": "Jakttid",
    "kalv_tid": "Jakttid kalv på oregistrerad mark",
    "namn_afo": "Älgförvaltningsområde",
    "forvaltare": "Förvaltare:",
    "afo_id": "Älgförvaltningsområde ID"
};
