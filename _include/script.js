var filelist = "";
var files;
window.onload = function(){
	//JSON 로그 파일에서 Object를 꺼내고, files 배열에 추가합니다.
	const fileInput = document.getElementById("fileUpload");
	fileInput.onchange = () => {
		filelist = [...fileInput.files];
		files = new Array();
		for(let i = 0; i < filelist.length; i++){
			let filename = filelist[i].name;
			$.getJSON("\\samples\\" + filename, function( data ) {
				let logObj = data.Records;
				logObj.fileName = filename;
				console.log(logObj);
				files.push(logObj);
			});
		}
	};
}
function Readfiles(){
	//https://docs.aws.amazon.com/ko_kr/awscloudtrail/latest/userguide/cloudtrail-event-reference-user-identity.html
	let tbody1 = document.getElementById('tbody');
	let log_count = document.getElementById('log_count');
	let eventName_count = document.getElementById('eventName_count');
	let count = 1;
	var user_count = new Map();
	var event_count = new Map();
	tbody1.innerHTML = "";
	log_count.innerHTML = "";
	eventName_count.innerHTML = "";
	
	for(let file of files){
		for(let obj of file){
			let innerHtml = "";

			var type = obj.userIdentity.type;
			if(type == "IAMUser"){
				type = obj.userIdentity.userName;
			}
			innerHtml = "<tr class=\"view\"><td>" + obj.eventTime + "</td><td>" + type +"</td><td>" + obj.eventName + "</td><td>" + obj.eventType + "</td><td>" + obj.sourceIPAddress + "</td><td>"+ obj.userAgent +"</td><td width=\"50\">" + file.fileName + "</td></tr><tr class=\"fold\"><td colspan=\"7\"><div class=\"fold-content\">" + JSON.stringify(obj) + "</div></td></tr>";
			tbody1.innerHTML += innerHtml;
			
			if(typeof(user_count.get(type)) == "undefined"){
				user_count.set(type, 1);
			}
			else{
				var pre_value = user_count.get(type);
				pre_value++;
				user_count.set(type, pre_value);
			}

			if(typeof(event_count.get(obj.eventName)) == "undefined"){
				event_count.set(obj.eventName, 1);
			}
			else{
				var pre_value = event_count.get(obj.eventName);
				pre_value++;
				event_count.set(obj.eventName, pre_value);
			}
		}
	}
	for (let entry of user_count) {
		log_count.innerHTML += "<li class=\"list-group-item d-flex justify-content-between align-items-center\">" + entry[0] + "<span class=\"badge bg-primary rounded-pill\">" + entry[1] + "</span></li>";	
  	}
	for (let entry of event_count) {
		eventName_count.innerHTML += "<li class=\"list-group-item d-flex justify-content-between align-items-center\">" + entry[0] + "<span class=\"badge bg-primary rounded-pill\">" + entry[1] + "</span></li>";	
  	}

	$(function () {
		$(".fold-table tr.view").on("click", function () {
		  $(this).toggleClass("open").next(".fold").toggleClass("open");
		});
	  });
	  
}