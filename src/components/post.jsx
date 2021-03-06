import React from 'react';
import PostData from '../data/postData.js';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = ({
      name: "",
      comment: "",
      comments: []
    });
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({[e.target.id]: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    var date = new Date;
    var fullDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    var body = {
      name: this.state.name,
      comment: this.state.comment,
      postName: this.props.params.name,
      date: fullDate
    };
    
    $.ajax({
      type: "POST",
      url: "/post-comments",
      data: JSON.stringify(body)
    });
    
    this.updateComments();
    this.setState({name: "", comment: ""});
  }
  updateComments() {
    $.ajax({
      url: "/get-comments",
      success: function(data) {
        var tempComments = data.reduce((arr,comment) => {
          if(comment.postName == this.props.params.name) {
            arr.push(
            <div className="comment">
              <div className="commentName">{comment.name}</div>
              <date>{comment.date}</date>
              <p className="commentBody">{comment.comment}</p>
            </div>);
          }
          return arr;
        },[]);
        this.setState({comments: tempComments});
      }.bind(this)
    });
  }
  componentDidMount(){
    this.updateComments();
  }
  render() {
    const name = this.props.params.name;
    const CurrentPost = PostData.filter(post => post.name == name)[0];
    return (
      <div>
        <div className="post postPageContainer">
          <Helmet
            title={CurrentPost.title + " - WebsiteDevTips"}
            meta={[
              {name: "description", content: `WebsiteDevTips - ${CurrentPost.title} ${CurrentPost.introduction}`},
              {name: "keywords", content: `${CurrentPost.keywords}`}
            ]}
          />
          <div className="postHeader">
            <img src={`../img/${CurrentPost.mainImage}`} alt="Post header image"/>
            <h1>{CurrentPost.title}</h1>
  
            <time>{CurrentPost.time}</time>
          </div>
  
          <div className="postBody">{CurrentPost.content}</div>
          <Link className="baseBtn" to="/posts">Go Back to Posts</Link>
        </div>
        <div className="commentForm">
          <form onSubmit={this.handleSubmit}>
            <div className="input">
              <input type="text" id="name" className="textInput" value={this.state.name} onChange={this.handleChange}/>
              
              <label htmlFor="name">Name</label>
            </div>
            <div className="input">
              <textarea type="text" id="comment" className="textArea" value={this.state.comment} onChange={this.handleChange}/>
              
              <label htmlFor="comment">Comment</label>
            </div>
            
            <button className="baseBtn" type="submit">Comment</button>
          </form>
        </div>
        <div className="comments">
        {this.state.comments}
        </div>
      </div>
    );
  }
}

export default PostPage;
