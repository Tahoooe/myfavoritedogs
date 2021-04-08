id = name => document.getElementById(name);
cl = name => document.getElementsByClassName(name);

(function() {
  // your page initialization code here
  // the DOM will be available here
  window.addEventListener('resize', addScreenWidthClasses);

  function addScreenWidthClasses() {
      if (window.innerWidth < 489) {
          document.body.classList.remove('mobile', 'smallTablet', 'tablet', 'desktop');
          document.body.classList.add('mobile');
      } else if (window.innerWidth < 768)  {
          document.body.classList.remove('mobile', 'smallTablet', 'tablet', 'desktop');
          document.body.classList.add('smallTablet');
      } else if (window.innerWidth < 992) {
          document.body.classList.remove('mobile', 'smallTablet', 'tablet', 'desktop');
          document.body.classList.add('tablet');
      } else {
          document.body.classList.remove('mobile', 'smallTablet', 'tablet', 'desktop');
          document.body.classList.add('desktop');
      }
  }

  addScreenWidthClasses();
})();

const list = document.getElementById('items');

function resetList() {
  list.innerHTML = '';

  // reset l'enregistrement de liste
  cl('nameContainer')[0].style.display = "flex";
  cl('linkContainer')[0].style.display = "none";
  id('copyLink').innerHTML = 'Copy link';
  id('share').style.display = "none";
}

// accordéon volé
const accordionBtns = document.querySelectorAll('.accordion');
let index = 0;
accordionBtns.forEach((accordion) => {
  
  accordion.onclick = function () { 
    this.classList.toggle('isOpen');
    let content = this.nextElementSibling;
    if (content.style.maxHeight) {
      //this is if the accordion is open
      content.style.maxHeight = null;
    } else {
      //if the accordion is currently closed
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  };

  // ouvre le premier au chargement 
  if (index === 0) { accordion.click(); } index++;

  

  // fix le responsive
  document.getElementsByTagName('body')[0].onresize = function() {
    let areOpen = document.querySelectorAll('.isOpen');
    
    areOpen.forEach((isOpen) => {
        let content = isOpen.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + 'px'; 
    })
  };

});



// retourne les slugs de la liste
function getValues(origin) {
    let elements;
    let names = [];

    if (origin === "checkboxes") {
      elements = document.querySelectorAll('input[type="checkbox"]:checked');
      elements.forEach((element) => {
        names.push(element.value.toString());
      })
    } else if (origin === "list") {
      elements = document.querySelectorAll('#items > li');
      elements.forEach((element) => {
        names.push(element.classList.toString());
      })
    }
    
    names = [...new Set(names)];
    
    return names;
}



// retourne la place d'un li
function getIndex(node) {
    let children = node.parentNode.children;
  
    for (i = 0; i < children.length; i++) {
      if (node == children[i]) break;
    }
    return i + 1;
  }

  
// donne leur place aux éléments de la liste
function listIndexes() {
    let elements = document.querySelectorAll('#items > li');

    // pour chaque li, trouver sa place
    elements.forEach((element) => {
        let place = element.querySelector('.place');
        place.innerHTML = '#' + getIndex(element);
    })
}


const baseurl = window.location.origin+window.location.pathname;
// mise à jour de la liste
// c'est sûrement pas ouf mais je vois pas comment faire autrement
function sendToList(breedSlug) {
    let breedData = document.querySelector('.' + breedSlug).children;
    let breedName = breedData[2].innerHTML;
    let breedImage = breedData[0].currentSrc.replace("small", "smaller");
    
    let fullLi = '<li class="' + breedSlug + '"><div class="delete" onclick="del(this.parentNode)"><img draggable="false" src="' + baseurl + 'images/moins.svg"></div><div class="breed"><img draggable="false" class="breedImage" src="' + breedImage + '"><span><span class="place"></span> - ' + breedName + '</span><img draggable="false" class="dragIcon" src="' + baseurl + 'images/drag.svg"></div></li>'; 

    list.insertAdjacentHTML('beforeend', fullLi);
}



// Actions quand les checkbox changent 
let checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach((checkbox) => {

    // coche les checkbox identiques
    checkbox.addEventListener("click", checkToo);
    function checkToo() {
        // trouve toutes les checkbox qui ont la même valeur que celle cliquée
        let toCheck = document.querySelectorAll('input[value="' + checkbox.value + '"');

        toCheck.forEach((value) => {
            // clique sur les checkbox qui ne sont pas celle cliquée
            
            if (value != checkbox && (event.isTrusted)) {
              value.click();
            }
        });
    }

    // met à jour la liste
    checkbox.addEventListener("click", updateList);
});


function del(element) {
  let toUnchecks = document.querySelectorAll('input[value="' + element.className + '"');

  // décoche tout ce qu'il y a à décocher
  toUnchecks.forEach((toUncheck) => {
    toUncheck.click();
  });

}


function updateList() {
    resetList(); 

    getValues("checkboxes").forEach((value) => {
        sendToList(value);
    })

    listIndexes();
    counter();
    sendToStorage();
}


//compteur de races & pannel behaviour
function counter() {
  // ajoute dans le compteur
  if (getValues("checkboxes").length === 0) {
    id('compteur').innerHTML = 'No breed selected.';

    document.body.classList.remove('open');
    document.body.classList.add('noSelection');

  } else if (getValues("checkboxes").length === 1) {
    id('compteur').innerHTML = getValues("checkboxes").length + ' breed selected.';

    document.body.classList.remove('noSelection');

  } else {
    id('compteur').innerHTML = getValues("checkboxes").length + ' breeds selected.';

    document.body.classList.remove('noSelection');
  }
}


function sendToStorage() {
    // reset le storage
    localStorage.clear();
    localStorage.setItem("breeds", JSON.stringify(getValues("list")));
}


// liste drag and sort
let sortable = Sortable.create(list, {
    animation: 150,
    onEnd: function() {
        listIndexes();
        sendToStorage();

        cl('nameContainer')[0].style.display = "flex";
        cl('linkContainer')[0].style.display = "none";
        id('copyLink').innerHTML = 'Copy link';
        id('share').style.display = "none";
    }
});




window.onload = function() {
  
  let values = JSON.parse(localStorage.getItem("breeds"));

  // s'il y a quelque chose dans le storage, cocher + mettre dans la liste
  if (values) {
    values.forEach((value) => {
        // recoche les cases à partir du local storage
        checkboxes.forEach((checkbox) => {
          if (checkbox.value === value) {
            checkbox.checked = true;
          }
        });
        sendToList(value);
        counter();
        listIndexes();
      })
  }
};







// gère la génération de lien
function genLink(e) {
  // si la liste est vide
  if (localStorage.getItem("breeds").length === 2) {
    id('error').style.display = "block";
    id('error').innerHTML = "Your list is empy!";
  // si aucun nom n'est entré
  } else if (!id("name").value) {
    id('error').style.display = "block";
    id('error').innerHTML = "Please enter your name.";
  // si nom entré + clic par humain
  } else if (e.isTrusted) {
    id('error').style.display = "none";
    
    let timerId;

    //Reset Timeout if function is called before it ends
    if (!(timerId == null)) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(function () {
      //Place code that you don't want to get spammed here

      // envoie les données en ajax dans la BDD
      let values = localStorage.getItem("breeds");
      
      var xhttp;

      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          // document.getElementById("result").innerHTML = this.responseText;
          cl('nameContainer')[0].style.display = "none";
          cl('linkContainer')[0].style.display = "flex";

          id('link').value = this.responseText;

          id('share').style.display = "block";
          id('twitterBlock').href = "https://twitter.com/intent/tweet?text=Here's%20a%20list%20of%20my%20favorite%20dog%20breeds! " + this.responseText;
          id('facebookBlock').href = "https://www.facebook.com/sharer/sharer.php?u=" + this.responseText;
          id('telegramBlock').href = "https://t.me/share/url?url=" + this.responseText + "&text=" + "Here's a list of my favorite dog breeds!";

          
        }
      };

      xhttp.open("GET", "senddata.php?q=" + values + "|" + id("name").value, true);
      xhttp.send();

    }, 200); //200ms Timeout
  // si pas clic par humain
  } else {
    id('error').style.display = "block";
    id('error').innerHTML = "Go away, bot.";
  }
}

// enter dans l'input
id('name') .onkeyup = function(e) {
  if(e.keyCode == 13){
    genLink(e);
  }
}

// clic sur le bouton de génération de lien
id("genLink").addEventListener('click', (e) => {
  genLink(e);
});




function copyLink() {
    /* Get the text field */
    var copyText = id("link");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
    /* Alert the copied text */
    id('copyLink').innerHTML = 'Link has been copied';

    setTimeout(function() { id('copyLink').innerHTML = 'Copy link';
    }, 5000);
}


function pannel(el) {
  document.body.classList.toggle('open');

  id('pannel').scrollTop = 0; // For Safari
  id('pannel').scrollTop = 0;
}


document.querySelector('.overlay').addEventListener('click', () => {
  pannel();
});

  
