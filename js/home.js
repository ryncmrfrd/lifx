if(typeof(Storage)!=="undefined"){if(localStorage.getItem('lifxAuthKey')){window.location.href='app.html'}}
else{document.write('<pre>Unfortunately, localstorage support is required to access this site</pre>')}
function submit(){var val=document.getElementById('appToken').value;if(!val){alert('Please enter a code before continuing')}
else{localStorage.setItem('lifxAuthKey',val);window.location.href='app.html'}}