import React, { Component } from "react";

// Components
import Modal from "../layout/Modal";
import CreatePostWindow from "../CreatePostWindow";

// API requests
import axios from "axios";

// Redux
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Post reactstrap-cards
import {
  Card,
  Button,
  CardImg,
  CardTitle,
  CardText,
  CardColumns,
  CardSubtitle,
  CardBody,
} from "reactstrap";
import CreateTransactionWindow from "./CreateTransactionWindow";

export class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postList: [],
      modalCreatePost: false,
      modalCreateTransaction: false,
      activePost: {
        title: "",
        price: "",
        date: "",
        location: "",
        category: "",
        saleOrBuy: "",
        description: "",
        user: "",
        contactInfo: "",
      },
      activeTransaction: {
        post: "",
        buyer: "",
        ratingFromSeller: "",
        ratingFromBuyer: "",
      },
    };
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };

  // Lifecycle method, invoked immediately after component is mounted.
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/posts")

      .then((res) => this.setState({ postList: res.data }))
      .catch((err) => console.log(err));
  };

  // refreshList = () => {
  //   axios
  //     .get("/api/users")
  //     .then((res) => this.setState({ userList: res.data }))
  //     .catch((err) => console.log(err));
  // };

  handleSubmitPost = (post) => {
    this.toggleCreatePostWindow();
    //if user exists, update user(PUT) ?
    if (post.id) {
      axios
        .put(`/api/posts/${post.id}/`, post)
        .then((res) => this.refreshList());
      return;
    }
    // else create new user (POST)
    axios.post("/api/posts/", post).then((res) => this.refreshList());
  };

  handleSubmitTransaction = (transaction) => {
    this.toggleCreateTransactionWindow();
    axios.post("/api/transaction/", transaction);
}

  // handleSellPost = (post, user) => {
    

  // }

  toggleCreatePostWindow = (event) => {
    this.setState({ modalCreatePost: !this.state.modalCreatePost });
  };
  
  toggleCreateTransactionWindow = (event) => {
    this.setState({ modalCreateTransaction: !this.state.modalCreateTransaction });
  };
  
  createPost = () => {
    const post = {
      title: "",
      price: "",
      date: "",
      location: "",
      category: "",
      saleOrBuy: "",
      description: "",
      user: this.props.auth.user.id,
      contactInfo: this.props.auth.user.email,
    };

    this.setState({
      activePost: post,
    });
  };
  createTransaction = () => {
    const transaction = {
      post: this.props.activePost.id,
      buyer: this.props.auth.user.id,
      ratingFromSeller: "",
      ratingFromBuyer: "",
    };

    this.setState({
      activeTransaction: transaction,
    });
  };


  // render posts
  renderItems = () => {
    const { isAuthenticated } = this.props.auth;

    const newItems = this.state.postList;

    return newItems.map((post) => (
      <li
        key={post.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>
          <Card>
            <CardBody
              inverse
              style={{ backgroundColor: "#D6DBDF ", borderColor: "#333" }}
            >
              {/* TODO: CardTitle skal egentlig automatisk bli stor, h3 skal ikkje vere nødvendig... */}
              <CardTitle>
                <h3>{post.title}</h3>
              </CardTitle>
              <CardImg
                top
                width="100%"
                //TODO: Legg in ein switch på post.category som bestemmer bildet
                src="https://en.parisinfo.com/var/otcp/sites/images/node_43/node_51/node_7112/salle-de-cin%C3%A9ma-%7C-630x405-%7C-%C2%A9-fotolia-he2/12344768-1-fre-FR/Salle-de-cin%C3%A9ma-%7C-630x405-%7C-%C2%A9-Fotolia-he2.jpg"
                alt="Card image cap"
              />

              <CardSubtitle>
                <br />
                <h5>Buying or selling: {post.saleOrBuy} </h5>
              </CardSubtitle>
              <CardSubtitle>
                {post.category} ticket in {post.location}
                <br />
                {post.date}
                <br />
                Price: {post.price}
              </CardSubtitle>
              <CardText>
                <br />
                {post.description}
                <br />
              </CardText>

              {isAuthenticated ? (
                <div>
                  <label>
                    {/* Todo: dette kan umulig være rett måte å få mellomrom etter "Contact" :] */}
                    {"Contact: "}
                    {/* Kan sette subject og body på emailen: ?subject=TicKing ticket: &body=Hello!" */}
                    <a
                      href={
                        "mailto:" +
                        post.contactInfo +
                        "?subject=TicKing ticket: " +
                        post.title
                      }
                    >
                      {post.contactInfo}
                    </a>
                  </label>
                  <button
                    onClick={() => {this.toggleCreateTransactionWindow()}}
                    className="nav-link btn btn-info btn-sm text-light"
                    >
                    Sell
                  </button>
                  {this.state.modalCreateTransaction ? (
                    <Modal
                      toggle={this.toggleCreateTransactionWindow}
                      modalTitle={<h3>Review Transaction</h3>}
                      modalContent={
                        <CreateTransactionWindow
                          activeTransaction={this.state.activeTransaction}
                          activePost={post}
                          onSave={this.handleSubmitTransaction}
                        />
                      }
                  />
                  ) : null}
                </div>
              ) : (
                <div>
                  <label>Contact: Log in to show contact information</label>
                </div>
              )}
            </CardBody>
          </Card>
        </span>
        <span>
          {/* TODO: Edit and Delete buttons here */}
          {/*<button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(post)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(post)}
          >
            Delete
          </button>*/}
        </span>
      </li>
    ));
  };

  render() {
    const { isAuthenticated } = this.props.auth;

    const createPostButton = (
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            this.toggleCreatePostWindow();
            this.createPost();
          }}
        >
          Create post
        </button>
      </div>
    );

    const guestMessage = <h4>Log in to create a new post</h4>;

    return (
      <div>
        {/* Vis/skjul createPostWindow */}
        {this.state.modalCreatePost ? (
          <Modal
            toggle={this.toggleCreatePostWindow}
            modalTitle={<h3>Create post</h3>}
            modalContent={
              <CreatePostWindow
                activePost={this.state.activePost}
                onSave={this.handleSubmitPost}
              />
            }
          />
        ) : null}
        {/* Vis/skjul createPostButton*/}
        {isAuthenticated ? createPostButton : guestMessage}
        {this.renderItems()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Posts);
