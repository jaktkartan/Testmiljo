// Oversattningstabell.js

//Dölj all data i popupfönstrena med följande fältnamn
var hideProperties = ['id', 'shape_leng', 'objectid', 'shape_area', 'field', 'AKTUALITET', 'TYP', 'Shape', 'GlobalID', 'OBJECTID', 'VATTENAREAL', 'LANDAREAL', 'ODLADAREAL', 'OVER_700_HM_AREAL', 'TATORTAREAL', 'UNGSKOGSAREAL', 'TOTALAREAL', 'Beslutadlandarealha', 'Senastebeslutsdatum'];
// Dölj fältnamn visa bara innehåll
var hideNameOnlyProperties = ['namn', 'BILD', 'Info', 'link', 'Kommun', 'NAMN', 'INFO', 'Rubrik', 'LÄN', 'lan_namn', 'GRÄNSÄLVSOMR'];

// Översättningstabell i popup-panelerna
var translationTable = {
    // Översättningstabell i popup-panelerna
    
    // Upptäck
    'DATUM_FRAN': 'Från',
    'DATUM_TILL': 'Till',
    
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
    "Kronhjort_Inom_Hjort": "Hjort - Inom Kronhjortsskötselområde",
    "Kronhjort_Inom_Hind_o_årsKalv": "Hind och årskalv - Inom Kronhjortsskötselområde",
    "Kronhjort_Utom_årsKalv": "Årskalv - Utom Kronhjortsskötselområde",
    "Kronhjort_dygnet": "Jakt under dygnet",
    "Kronhjort_kaliber": "Kaliberkrav",
    "Kronhjort_hagel": "Hagelvapen",
    "Kronhjort1_Skåne_Inom": "Kronhjort - Inom Kronhjortsskötselområde",
    "Kronhjort2_Skåne_Utom": "Kronhjort - Utom Kronhjortsskötselområde",
    
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
    

};
