

 class CatergoryContainer {
     


   static toggler(){

    let displayCatergory = 
    document.querySelector('.catergoryContainer');

    let Catergory = 
    document.querySelector('.catergories'); 

    // let body = document.queryselector('.body')

    Catergory.addEventListener('click', () => {

     displayCatergory
     .classList.toggle('catergoryContainerDisplay')
    });


    


   }


 }

 CatergoryContainer.toggler();