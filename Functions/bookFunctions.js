if (typeof current_page == 'undefined') {
  let previous_page = "";
  window.previous_page = previous_page;
  let current_page = "";
  window.current_page = current_page;
}




function parseJSONString(jsonString) {
  try {
    const obj = JSON.parse(jsonString);
    // If jsonString is a valid JSON, return the parsed object
    return obj;
  } catch (error) {
    // If jsonString is not a valid JSON, log an error or handle it
    console.error("String is not a valid JSON:", error);
    return null;
  }
}







function book() {
  outputField.innerHTML = "";
  if (bookOfPages.hasOwnProperty("list")) {
    delete bookOfPages["list"];
  }
  if (x == 0 && y == 0 && z == 0) {
    if (input == "new page") { // WANT TO MAKE A NEW PAGE
      x = "new page";
      newLine("Creating new page, please enter the title of the page");
    } else if (input == "edit page" && current_page != "book") { // IF EDITIING CURRENT PAGE TEXT
      x = "edit page";
      newLine("Please enter the new Text for this page.")
      lowerCaseInput = false;
    } else if (input == "save") {
      let save = JSON.stringify(bookOfPages);
      outputField.innerHTML = save;
    } else if (input == "load") {
      newLine("Please enter the text to Load and press enter.");
      x = "load";
      lowerCaseInput = false;
    } else if (input == "delete page" && current_page != "book") { // IF DELETING CURRENT PAGE
      x = "delete page";
      newLine(`Are you sure you want to delete page : ${current_page}?\n\n<hr>\n1 - Yes\n\n2 - No`);
    } else if (input == "list") { // CALLING FOR A LIST OF ALL PAGES
      let listOutput = "Here is a list of every page:\n\n";
      let listOfKeys = Object.keys(bookOfPages);
      for (let i=0; i<listOfKeys.length; i++) {
        listOutput += "- " + listOfKeys[i] + "\n";
      }
      bookOfPages["list"] = listOutput;
      outputField.style.textAlign = "center";
      outputField.innerHTML = `<h1>list</h1><hr>${bookOfPages["list"]}`;
    } else if (input == "back") { // IF GOING BACK TO PREVIOUS PAGE
      current_page = previous_page;
      outputField.style.textAlign = "center";
      outputField.innerHTML = `<h1>${current_page}</h1><hr>${bookOfPages[current_page]}`;
    } else if (bookOfPages.hasOwnProperty(input)) { // IF YOU ARE MOVING TO A PAGE THAT EXISTS
      previous_page = current_page;
      current_page = input;
      outputField.style.textAlign = "center";
      outputField.innerHTML = `<h1>${input}</h1><hr>${bookOfPages[input]}`;
    } else { // IF THERE IS NOT A PAGE OF WHAT YOU HAVE TYPED
      newLine(`Page : ${input} does not exist.`)
      enterButton.disabled = true;
      setTimeout(() => {
        outputField.style.textAlign = "center";
        outputField.innerHTML = `<h1>${current_page}</h1><hr>${bookOfPages[current_page]}`;
        enterButton.disabled = false;
      }, 2000);
    }
  
  } else {
    if (x == "new page") {
      if (y == 0) {
        y = input;
        newLine("Please enter the Pages text.")
        lowerCaseInput = false;
      } else {
        if (z == 0) {
          z = input;
          lowerCaseInput = true
          newLine(`Page Created.\nPage Title : ${y}\nPage Text : ${z}.\nIs this correct?\n\n<hr>\n1 - Yes\n\n2 - No`);
        } else {
          if (input == 1 || input == "yes") {
            bookOfPages[y] = z;
            outputField.style.textAlign = "center";
            outputField.innerHTML = `<h1>${y}</h1><hr>${bookOfPages[y]}`;
            previous_page = current_page;
            current_page = y;
            x = 0;
            y = 0;
            z = 0;
          } else if (input == 2 || input == "no") {
            newLine("Page creation cancelled.")
            x = 0;
            y = 0;
            z = 0;
          }
        }
      }
    
    } else if (x == "load") {
      if (parseJSONString(input)) {
        bookOfPages = parseJSONString(input);
        lowerCaseInput = true;
        outputField.style.textAlign = "center";
        outputField.innerHTML = `<h1>book</h1><hr>${bookOfPages["book"]}`;
        current_page = "book";
        x = 0;
      } else {
        x = 0;
        outputField.style.textAlign = "center";
        outputField.innerHTML = `<h1>Error loading text</h1><hr>Please press Back to resume to your last page.`;
      }
    } else if (x == "edit page") {
      bookOfPages[current_page] = input;
      lowerCaseInput = true;
      outputField.style.textAlign = "center";
      outputField.innerHTML = `<h1>${current_page}</h1><hr>${bookOfPages[current_page]}`;
      x = 0;
    } else if (x == "delete page") {
      if (input == 1 || input == "yes") {
        delete bookOfPages[current_page];
        outputField.style.textAlign = "center";
        outputField.innerHTML = `<h1>book</h1><hr>${bookOfPages["book"]}`;
        x = 0;
      } else if (input == 2 || input == "no") {
        x = 0;
        outputField.style.textAlign = "center";
        outputField.innerHTML = `<h1>Deleting Cancelled</h1><hr>Please press Back to resume to your last page.`;
      }
    }
  }
}

book();
