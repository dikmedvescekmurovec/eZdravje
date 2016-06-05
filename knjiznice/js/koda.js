
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var authorization = "Basic " + btoa(username + ":" + password);

var pacient1 = {};
var pacient2 = {};
var pacient3 = {};
var pacienti = {pacient1, pacient2, pacient3};
var stPacientov = 0;
var ehrId;
var ehrIds;
var avgHeight, avgWeigth;

/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}




/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
 
 function generirajVsePodatke(){
     generirajPodatke(0, function(ehrId){
        shraniVitalnePodatke(ehrId, 0);
        $("#EHRZnanegaUporabnika").append("<option value=\"0\" id=\"morty\">" + pacient1.ime + " " + pacient1.priimek + "</option>")
     });
      generirajPodatke(1, function(ehrId){
        shraniVitalnePodatke(ehrId, 1);
        $("#EHRZnanegaUporabnika").append("<option value=\"1\" id=\"summer\">" + pacient2.ime + " " + pacient2.priimek + "</option>")

     });
      generirajPodatke(2, function(ehrId){
        shraniVitalnePodatke(ehrId, 2);
        $("#EHRZnanegaUporabnika").append("<option value=\"2\" id=\"rick\">" + pacient3.ime + " " + pacient3.priimek + "</option>")
     });
     stPacientov+=3;
 }
 
function preberiTrenutnegaPacienta(){
    console.log($("#EHRZnanegaUporabnika").find(":selected").html());
    if($("#EHRZnanegaUporabnika").find(":selected").text() == "Morty Smith"){
        return pacient1;   
    }
    if($("#EHRZnanegaUporabnika").find(":selected").text()== "Summer Smith"){
        return pacient2;   
    }
    return pacient3;
}
 
function generirajPodatke(stPacienta, callback) {

    switch(stPacienta){
        case 0:
            pacient1.ime = "Morty";
            pacient1.priimek = "Smith";
            pacient1.visina = "156";
            pacient1.teza = "40";
            pacient1.temperatura = "37";
            pacient1.sTlak = "120";
            pacient1.dTlak = "80";
            pacient1.nasicenostKsK = "95";
            pacient1.DoB = "1982-7-18T19:30"
            break;
        case 1:
            pacient2.ime = "Summer";
            pacient2.priimek = "Smith";
            pacient2.visina = "166";
            pacient2.teza = "70";
            pacient2.temperatura = "36.5";
            pacient2.sTlak = "115";
            pacient2.dTlak = "75";
            pacient2.nasicenostKsK = "97";
            pacient2.DoB = "1972-7-18T19:30"
            break;
        case 2:
            pacient3.ime = "Rick";
            pacient3.priimek = "Sanchez";
            pacient3.visina = "190";
            pacient3.teza = "70";
            pacient3.temperatura = "35";
            pacient3.sTlak = "100";
            pacient3.dTlak = "60";
            pacient3.nasicenostKsK = "90";
            pacient3.DoB = "1952-7-18T19:30"
            break;
    }
    
    var pacient;
    switch(stPacienta){
        case 0:
            pacient = pacient1;
            break;
        case 1:
            pacient = pacient2;
            break;
        case 2:
            pacient = pacient3;
            break;
        default:
            pacient.ime = $("#imePacienta").text();
            pacient.priimek = $("#priimekPacienta").text();
            pacient.visina = $("#visinaPacienta").text();
            pacient.teza = $("#tezaPacienta").text();
            pacient.temperatura = $("#temperaturaPacienta").text();
            pacient.sTlak = $("#sTlakPacienta").text();
            pacient.dTlak = $("#dTlakPacienta").text();
            pacient.nasicenostKsK = $("#kisikVKrviPacienta").text();
            break;
    }

    $.ajaxSetup({
        headers: {
            "Authorization": authorization
        }
    });
    $.ajax({
        url: baseUrl + "/ehr",
        type: 'POST',
        success: function (data) {
            callback(data.ehrId)
            ehrId = data.ehrId;
            $("#message").append("<p>EHR Novega pacienta: " + ehrId + "</p>")
            pacient.ehrId = ehrId;
            // build party data
            var partyData = {
                firstNames: pacient.ime,
                lastNames: pacient.priimek,
                dateOfBirth: pacient.DoB,
                partyAdditionalInfo: [
                    {
                        key: "ehrId",
                        value: ehrId
                    }
                ]
            };
            $.ajax({
                url: baseUrl + "/demographics/party",
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(partyData),
                success: function (party) {
                    if (party.action == 'CREATE') {
                        $("#result").html("Created: " + party.meta.href);
                    }
                }
            });
        }
    });
}

function dodajVitalnePodatke(ehrId){
    if($("#EHRPacienta").empty()){
        
    } else {
        
    }
}

function shraniVitalnePodatke(ehrId, i){
    var pacient;
    switch(i){
        case 0:
            pacient = pacient1;
            break;
        case 1:
            pacient = pacient2;
            break;
        case 2:
            pacient = pacient3;
            break;
    }
    console.log(pacient);
    $.ajaxSetup({
        headers: {
            "Authorization": authorization
        }
    });
    var compositionData = {
        "ctx/time": "2016-6-05T13:10Z",
        "ctx/language": "en",
        "ctx/territory": "CA",
        "vital_signs/body_temperature/any_event/temperature|magnitude": parseFloat(pacient.temperatura),
        "vital_signs/body_temperature/any_event/temperature|unit": "°C",
        "vital_signs/blood_pressure/any_event/systolic": parseFloat(pacient.sTlak),
        "vital_signs/blood_pressure/any_event/diastolic": parseFloat(pacient.dTlak),
        "vital_signs/height_length/any_event/body_height_length": parseFloat(pacient.visina),
        "vital_signs/body_weight/any_event/body_weight": parseFloat(pacient.teza)
    };
    var queryParams = {
        "ehrId": ehrId,
        templateId: 'Vital Signs',
        format: 'FLAT'
    };
    $.ajax({
        url: baseUrl + "/composition?" + $.param(queryParams),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(compositionData),
        success: function (res) {
        }
    });
}

function preberiPodatke(){
    pacient = preberiTrenutnegaPacienta();
    ehrId = pacient.ehrId;
    $("#imePacienta").val(pacient.ime);
    $("#priimekPacienta").val(pacient.priimek);
    $("#EHRPacienta").val(pacient.ehrId);
    
    $.ajaxSetup({
        headers: {
            "Authorization": authorization
        }
    });
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/blood_pressure",
        type: 'GET',
        success: function (res) {
            $("#sTlakPacienta").val(res[0].systolic);
            $("#dTlakPacienta").val(res[0].diastolic);
        }
    });
    $("#tezaPacienta").val(pacient.teza);
    $("#temperaturaPacienta").val(pacient.temperatura);
    $("#visinaPacienta").val(pacient.visina);
    $("#kisikVKrviPacienta").val(pacient.nasicenostKsK);
    
    console.log(preberiTrenutnegaPacienta());
}

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
function izrisiPodatke(){
    preberiPodatke();
    var pacient = preberiTrenutnegaPacienta();
    console.log(pacient);
    $("#izrisPodatkov").html("");
    $("#izrisPodatkov").append("<p>" + pacient.ime + " " + pacient.priimek + "</p>");
    $("#izrisPodatkov").append("<p id=\"telesnaVisina\">Telesna višina: " + pacient.visina + "  <button type=\"button\" class =\"btn btn-primary btn-xs\" onclick=\"razsiriVisina();\">Razširi</button></p>");
    $("#izrisPodatkov").append("<p id=\"telesnaTeza\">Telesna teža: " + pacient.teza + "  <button type =\"button\" class =\"btn btn-primary btn-xs\" onclick=\"razsiriTeza();\">Razširi</button></p>");
    $("#izrisPodatkov").append("<p>Telesna temperatura: " + pacient.temperatura + "</p>");
    $("#izrisPodatkov").append("<p>Sistolični krvni tlak: " + pacient.sTlak + "</p>");
    $("#izrisPodatkov").append("<p>Diastolični krvni tlak: " + pacient.dTlak + "</p>");
    $("#izrisPodatkov").append("<p>Nasičenost krvi s kisikom: " + pacient.nasicenostKsK + "</p>");
    izracunPovprecij();
}

function razsiriTeza(){
    var pacient = preberiTrenutnegaPacienta();
    podriVisina();
    $("#telesnaTeza").html("Telesna Teža: " + pacient.teza + "  <button type=\"button\" class =\"btn btn-primary btn-xs\" onclick=\"podriTeza();\">Podri</button></p>");
    dodajGraf("#telesnaTeza", 50 + parseInt(pacient.teza) - avgWeight);
}

function razsiriVisina(){
    var pacient = preberiTrenutnegaPacienta();
    podriTeza();
    $("#telesnaVisina").html("Telesna višina: " + pacient.visina + "  <button type=\"button\" class =\"btn btn-primary btn-xs\" onclick=\"podriVisina();\">Podri</button></p>");
    dodajGraf("#telesnaVisina", 50 + parseInt(pacient.visina) - avgHeight);
}
    
function podriVisina(){
    var pacient = preberiTrenutnegaPacienta();
    $("#telesnaVisina").html("Telesna višina: " + pacient.visina + "  <button type=\"button\" class =\"btn btn-primary btn-xs\" onclick=\"razsiriVisina();\">Razširi</button></p>");
}
    
function podriTeza(){
    var pacient = preberiTrenutnegaPacienta();
    $("#telesnaTeza").html("Telesna Teža: " + pacient.teza + "  <button type=\"button\" class =\"btn btn-primary btn-xs\" onclick=\"razsiriTeza();\">Razširi</button></p>");
}
    
function dodajGraf(ime, procent){
    $(ime).append("<svg text-align=\"left\" id=\"fillgauge1\" width=\"97%\" height=\"250\"></svg><script language=\"JavaScript\">var gauge1 = loadLiquidFillGauge(\"fillgauge1\", " + procent + ");var config1 = liquidFillGaugeDefaultSettings();config1.circleColor = \"#FF7777\";config1.textColor = \"#FF4444\";config1.waveTextColor = \"#FFAAAA\";config1.waveColor = \"#FFDDDD\";config1.circleThickness = 0.2;config1.textVertPosition = 0.2;config1.waveAnimateTime = 1000;</script>");
}
    
function izracunPovprecij(){
    avgHeight = 176;
    avgWeight = 73;
}    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

