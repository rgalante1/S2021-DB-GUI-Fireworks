import React from 'react';
import "./PostDisplay.css";
import { PostsRepository } from '../api/PostRepository'
import { AccountsRepository } from '../api/AccountRepository';

export class EditPostDisplay extends React.Component{
  postRepo = new PostsRepository();
  accountRepo = new AccountsRepository();

  constructor(props){
    super(props);
    this.state = {
      title: props.post.title,
      desc: props.post.description,
      meeting: props.post.type === "meeting",
      date: props.post.date,
      time: '',
      loc: props.post.location,
      virtual: !props.post.virtual,
      submit: false,
      company: props.post.username,
      link: props.post.meetingLink,
      id: props.post.id,
      deleted: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(event){
    if(this.state.meeting){
      this.postRepo.deleteMeeting(this.state.id).then( x =>{
          this.setState({deleted: true});
      });
    }
    else{
      this.postRepo.deletePost(this.state.id).then( x=>{
        this.setState({deleted: true});
      });
    }
    event.preventDefault();
  }
  
  handleChange(event){
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    if(!this.state.meeting){
      event.preventDefault();
      this.postRepo.updatePost(this.state.id, this.state.title, this.state.desc).then( x =>
          {
            alert("Updated post");
          }
      );
    }
    else{
        event.preventDefault();
        this.postRepo.updateMeeting(this.state.id, this.state.desc, this.state.time, this.state.link,  
        this.state.loc, this.state.virtual ? 0 : 1, this.state.date, this.state.title).then( x =>
            {
              alert("Updated meeting");
            }
        );
    }
  }

  render() {
    return (<>
    { !this.state.deleted &&
      <div className="postDisplay container mt-1 mb-1 py-4">
        <form  className="card container py-4" id="createPost">
          <label htmlFor="title" >
            <input type="text"  name="title" value={this.state.title || ""} placeholder={this.state.title || 
                "Enter Title"} onChange={this.handleChange} className="form-control" />
          </label>
          <label htmlFor="desc">
            <textarea rows="5" name="desc" value={this.state.desc} placeholder={this.state.desc || 
            "Your text here"} onChange={this.handleChange} className="form-control" />
          </label>
          { 
          this.state.meeting && <>
            <label htmlFor="loc">
                <input type="text" name="loc" value={this.state.loc} 
                placeholder={this.state.loc|| "Location"} disabled={(this.state.virtual) ? "disabled" : ""} 
                onChange={this.handleChange} className="form-control" />
              </label>
              <label htmlFor="date">
                <input type="date" name="date" onChange={this.handleChange} className="form-control" />
              </label>
              <label htmlFor="time">
                <input type="time" name="time" value={this.state.time} 
                onChange={this.handleChange} className="form-control" />
              </label>
              <label htmlFor="virtual" className="form-check">
                <input type="checkbox" name="virtual" value={this.state.virtual} 
                onChange={this.handleChange} className="form-check-input" checked={this.state.virtual}/>
                <span className="checkboxText">Virtual</span>
              </label>
              {
                this.state.virtual &&
                <label htmlFor="link">
                  <input type="text" name="link" value={this.state.link} 
                  onChange={this.handleChange} className="form-control" 
                  placeholder={this.state.meetingLink || "Meeting Link"}/>
                </label>
              }
            </>
          }
          { 
          <>
          <button className="col btn btn-danger rounded-pill mt-2" onClick={this.handleDelete}>Delete</button>
          <button  className="col btn btn-success rounded-pill mt-2"
          onClick={this.handleSubmit}>Save Changes </button>
          </>}
        </form>
      </div>
      }
      </>
    )
  }
}