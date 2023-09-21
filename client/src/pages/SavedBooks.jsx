import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";

// import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});

  const { loading, data } = useQuery(GET_ME);
  // const { loading, error, data } = useQuery(GET_ME, {
  //   variables: { username: Auth.getProfile().data.username },
  // });

  const [removeBook] = useMutation(REMOVE_BOOK);

  // If data.me exists set it to userData if not an empty object
  const userData = data?.me || {};
  // setUserData(data);

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (err) {
  //   return err.message;
  // }

  console.log("userdata", userData);

  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = Object.keys(userData).length;

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const token = Auth.loggedIn() ? Auth.getToken() : null;

  //       if (!token) {
  //         return false;
  //       }

  //       const response = await getMe(token);

  //       if (!response.ok) {
  //         throw new Error("something went wrong!");
  //       }

  //       const user = await response.json();
  //       setUserData(user);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   getUserData();
  // }, [userDataLength]);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database

  const handleDeleteBook = async (book) => {
    console.log(book);
    console.log({
      bookId: book.bookId,
      authors: book.authors,
      title: book.title,
      description: book.description,
      image: book.image,
    });
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // const response = await deleteBook(bookId, token);
      const { data } = await removeBook({
        variables: {
          bookData: {
            bookId: book.bookId,
            authors: book.authors,
            title: book.title,
            description: book.description,
            image: book.image,
          },
        },
      });

      // if (!response.ok) {
      //   throw new Error("something went wrong!");
      // }

      // const updatedUser = await response.json();
      // setUserData(updatedUser);
      // upon success, remove book's id from localStorage
      removeBookId(book.bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  // if (!userDataLength) {
  //   return <h2>LOADING...</h2>;
  // }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {/* using userData.me to pull all user data */}
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"}:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col key={book.bookId} md="4">
                <Card border="dark">
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
  // return (
  //   <>
  //     <div className="text-light bg-dark p-5">
  //       <Container>
  //         <h1>Viewing saved books!</h1>
  //       </Container>
  //     </div>
  //     <Container>
  //       <h2 className="pt-5">
  //         {/* using userData.me to pull all user data */}
  //         {userData.me.savedBooks.length
  //           ? `Viewing ${userData.me.savedBooks.length} saved ${userData.me.savedBooks.length === 1 ? "book" : "books"}:`
  //           : "You have no saved books!"}
  //       </h2>
  //       <Row>
  //         {userData.me.savedBooks.map((book) => {
  //           return (
  //             <Col key={book.bookId} md="4">
  //               <Card border="dark">
  //                 {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
  //                 <Card.Body>
  //                   <Card.Title>{book.title}</Card.Title>
  //                   <p className="small">Authors: {book.authors}</p>
  //                   <Card.Text>{book.description}</Card.Text>
  //                   <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
  //                     Delete this Book!
  //                   </Button>
  //                 </Card.Body>
  //               </Card>
  //             </Col>
  //           );
  //         })}
  //       </Row>
  //     </Container>
  //   </>
  // );
};

export default SavedBooks;
