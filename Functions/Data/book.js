

if (typeof bookOfPages == 'undefined') {
  let bookOfPages = {"book" : "Welcome to the book, you can use 'new page' to create new pages.\n'edit page' will allow you to quickly edit the pages text.\n'delete page' will give you the option to delete the page your currently looking at.\nTo navigate this book and look at other pages you just have to type the name of the page and hit Enter.\nFor a list of every page in this book just type 'list'.\nTo close the book and return back to Cal just type 'exit'."};
  window.bookOfPages = bookOfPages;
}

addFunctionHTML("book", "bookFunctions")