import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Form from "./components/Form";
import BookChoice from "./components/BookChoice";
import BookSelection from "./components/BookSelection";
import SelectionContext from "./contexts/SelectionContext";
import Message from "./components/Message";
import BookValidation from "./components/BookValidation";
import Recommendations from "./components/Recommendations";

const App = () => {
  const [bookSearch, SetBookSearch] = useState("Ken FOLLETT");
  const [bookSearchList, SetBookSearchList] = useState();
  const [fetchStatus, SetFetchStatus] = useState(false);
  const [bookSelection, SetBookSelection] = useState([]);
  const [currentBook, SetCurrentBook] = useState();
  const [convertedBook, SetConvertedBook] = useState();
  const [message, SetMessage] = useState();
  const [databaseBooks, SetDatabaseBooks] = useState();
  const [recommendation, SetRecommendation] = useState("");

  useEffect(() => {
    if (bookSearch.length >= 4) {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${bookSearch}`)
        .then((response) => response.json())
        .then((data) => {
          // SetBookSearchList(data.items.slice(0, 20))
          let queryBook = [];
          data.items.forEach((item) => {
            if (
              "industryIdentifiers" in item.volumeInfo &&
              "imageLinks" in item.volumeInfo
            ) {
              if (item.volumeInfo.industryIdentifiers[0].type !== "OTHER") {
                queryBook.push(bookConverter(item));
              }
            }
          });
          SetBookSearchList(queryBook);
          SetFetchStatus(true);
        })
        .catch((error) => SetFetchStatus(false));
    } else {
      SetBookSearchList("");
    }
  }, [bookSearch]);

  useEffect(() => {
    fetch("https://book-suggestion.herokuapp.com/books")
      .then((response) => response.json())
      .then((books) => {
        SetDatabaseBooks(books.slice(0, 100));
        console.log(databaseBooks);
      })
      .catch((error) => console.log("error:", error));
  }, []);

  const handleCheck = (book) => {
    return bookSelection.some(
      (checkedBook) => book.title === checkedBook.title
    );
  };

  const addBookToSelection = (book) => {
    SetCurrentBook(book);
    if (bookSelection.length < 5) {
      if (!handleCheck(book)) {
        SetBookSelection([...bookSelection, book]);
        SetMessage("");
      } else {
        SetMessage("This book is already in your selection");
      }
    } else {
      SetMessage(
        "You already seleected 5 books. Please remove on to add a new one"
      );
    }
    let selection = document.getElementById("selection");
    console.log(selection);

    selection.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const deleteMessage = () => {
    SetMessage("");
  };

  const saveSelection = () => {
    getSelections();
    // fetch("https://book-suggestion.herokuapp.com/selections", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    //   body: JSON.stringify(bookSelection),
    // })
    //   .then((response) => response.json())
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log("error:", error));
  };

  const getSelections = () => {
    fetch("https://book-suggestion.herokuapp.com/selections")
      .then((response) => response.json())
      .then((response) => FindTwinSelections(response))
      .catch((error) => console.error("error:", error));
  };

  const deleteBook = (book) => {
    const newSelection = bookSelection.filter(
      (selectionBook) => selectionBook.title !== book.title
    );
    SetBookSelection(newSelection);
  };

  const bookConverter = (book) => {
    let newBook = {};
    newBook["ISBN_13"] = book.volumeInfo.industryIdentifiers[0].identifier;
    newBook["ISBN_10"] = book.volumeInfo.industryIdentifiers[1].identifier;
    newBook["image"] = book.volumeInfo.imageLinks.smallThumbnail;
    newBook["title"] = book.volumeInfo.title;
    newBook["author"] = book.volumeInfo.authors[0];
    newBook["year"] = book.volumeInfo.publishedDate;

    SetConvertedBook(newBook);
    return newBook;
  };

  /////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////ALGORITHME///////////////////////////////////////////////////

  const FindTwinSelections = (allDbSelections) => {
    console.log("allDbSelections", allDbSelections);
    let recos = [];
    allDbSelections.forEach((dbSelection) => {
      dbSelection.books.forEach((book) => {
        for (let i = 0; i < bookSelection.length; i++) {
          console.log("bookSelection", bookSelection);
          if (book.ISBN_13 === bookSelection[i].isbn13) {
            let newSelection = dbSelection.books.filter(
              (book) => book.ISBN_13 !== bookSelection[i].isbn13
            );
            // recos.push(newSelection);
            recos.concat(newSelection);
            console.log("newSelection", newSelection);
            console.log(recos);
          }
        }
      });
    });
    console.log("recos:", recos);
    getFinalArray(recos);
  };

  const getFinalArray = (recos) => {
    let vrac = [];
    recos.forEach((grap) => {
      grap.forEach((book) => vrac.push(book));
    });

    var finalarray = [];
    var copy = vrac.slice(0);
    for (var i = 0; i < vrac.length; i++) {
      var myCount = 0;
      // loop over every element in the copy and see if it's the same
      for (var w = 0; w < copy.length; w++) {
        if (copy[w] == undefined) {
          continue;
        } else {
          if (vrac[i].ISBN_13 == copy[w].ISBN_13) {
            myCount++;
            delete copy[w];
          }
        }
      }
      if (myCount > 0) {
        var a = new Object();
        a.value = vrac[i];
        a.count = myCount;
        finalarray.push(a);
      }
    }
    let sortedFinalArray = finalarray.sort((a, b) =>
      a.count < b.count ? 1 : -1
    );
    console.log("sortedFinalArray", sortedFinalArray);
    setSuggestion(sortedFinalArray);
  };

  /////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////ALGORITHME///////////////////////////////////////////////////

  const setSuggestion = (items) => {
    SetRecommendation(items.slice(0, 5));
    console.log(recommendation);
  };

  return (
    <div>
      <Header />

      <SelectionContext.Provider
        value={{ addBook: (book) => addBookToSelection(book) }}
      >
        <div className="container">
          {message && (
            <Message dismissAlert={deleteMessage} message={message} />
          )}
          {currentBook && (
            <BookSelection
              bookSelection={bookSelection}
              deleteBook={deleteBook}
            />
          )}
          <span id="selection"></span>
          {bookSelection.length >= 5 ? (
            <BookValidation confirmSelection={saveSelection} />
          ) : (
            <></>
          )}
          {/* {recommendation && (
            <Recommendations recommendation={recommendation} />
          )} */}
          <Form bookSearch={bookSearch} addBook={SetBookSearch} />
          {bookSearchList && fetchStatus && (
            <BookChoice bookList={bookSearchList} />
          )}
          <h3 className="mt-5 text-info">
            ..or choose some books amoung those one :
          </h3>
          {databaseBooks && <BookChoice bookList={databaseBooks} />}
        </div>
      </SelectionContext.Provider>
    </div>
  );
};

export default App;
