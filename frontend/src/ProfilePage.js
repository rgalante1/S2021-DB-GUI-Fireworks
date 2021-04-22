import './ProfilePage.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { AccountsRepository } from './api/AccountRepository'

export default class ProfilePage extends React.Component {
    accountRepo = new AccountsRepository();

    constructor(props) {
        super(props);
        this.state = {
            UserName: '',
            FirstName: '',
            LastName: '',
            UserNameLooking: '',
            CompanyName: '',
            AboutMe: '',
            JobTitle: '',
            Location: '',
            PhoneNumber: '',
            EmailAddress: '',
            ProfilePhotoURL: 'https://retailx.com/wp-content/uploads/2019/12/iStock-476085198.jpg',
            MessageText: 'Hello! I\'d love to schedule a meeting with you if possible. Let me know!',

        }
        this.handleChange = this.handleChange.bind(this);
        this.buttonEdit = this.buttonEdit.bind(this);
        this.imageExists = this.imageExists.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value })
        if (name === "UserName" && this.state.UserName === this.state.UserNameLooking)
            this.setState({ UserNameLooking: value })
    }

    imageExists(image_URL) {
        var http = new XMLHttpRequest();

        http.open('HEAD', image_URL, false);
        http.send();

        return http.status !== 404;
    }

    buttonEdit(props) {
        if (this.state.UserName === this.state.UserNameLooking) {
            return (
                <div className="wrapper">
                    <button type="button" className="btn btn-secondary buttonEdit" data-toggle="modal" data-target="#changeInfoModal">Edit Information</button>

                    <div className="modal fade" id="changeInfoModal" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-lg modal-dialog-scrollable" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Make any changes:</h5>
                                </div>
                                <div className="modal-body overflow-auto">
                                    <form className="changeForm">
                                        <div className="form-group">
                                            <label htmlFor="FirstName" className="labels">First Name:</label><br />
                                            <input type="form-control" className="form-control border border-secondary" id="FirstName" name="FirstName" value={this.state.FirstName} onChange={this.handleChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="LastName" className="labels">Last Name:</label><br />
                                            <input type="form-control" className="form-control border border-secondary" id="LastName" name="LastName" value={this.state.LastName} onChange={this.handleChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="CompanyName" className="labels">Company Name:</label><br />
                                            <input type="form-control" className="form-control border border-secondary" id="CompanyName" name="CompanyName" value={this.state.CompanyName} onChange={this.handleChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="JobTitle" className="labels">Job Title:</label><br />
                                            <input type="form-control" className="form-control border border-secondary" id="JobTitle" name="JobTitle" value={this.state.JobTitle} onChange={this.handleChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="ProfilePhotoURL" className="labels">Profile Photo URL:</label><br />
                                            <input type="form-control" className="form-control border border-secondary" id="ProfilePhotoURL" name="ProfilePhotoURL" value={this.state.ProfilePhotoURL} onChange={this.handleChange} />
                                            <small id="ProfilePhotoURL" className="form-text text-muted">Please use a link, such as an IMGUR link.</small>
                                        </div>

                                        <img src={this.imageExists(this.state.ProfilePhotoURL) ? this.state.ProfilePhotoURL : "https://www.civhc.org/wp-content/uploads/2018/10/question-mark.png"} alt="ERROR" className="center-block rounded-circle" height="100" width="100" />

                                        <div className="form-group">
                                            <label htmlFor="Location" className="labels">Location:</label><br />
                                            <input type="form-control" className="form-control border border-secondary" id="Location" name="Location" value={this.state.Location} onChange={this.handleChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="PhoneNumber" className="labels">Phone Number:</label><br />
                                            <input type="tel" className="form-control border border-secondary" id="PhoneNumber" name="PhoneNumber" value={this.state.PhoneNumber} onChange={this.handleChange} />
                                            <small id="PhoneNumber" className="form-text text-muted">Format: 123-456-7890</small>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="EmailAddress" className="labels">Email Address:</label><br />
                                            <input type="email" className="form-control border border-secondary" id="EmailAddress" name="EmailAddress" value={this.state.EmailAddress} onChange={this.handleChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="AboutMe" className="labels">About Me:</label><br />
                                            <textarea className="form-control ml-0 border border-secondary" id="AboutMe" name="AboutMe" rows="5" value={this.state.AboutMe} onChange={this.handleChange} />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-success" data-dismiss="modal">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )

        }
        else {
            return (
                <div className="wrapper">
                    <button type="button" className="btn btn-success buttonEdit" id="invitebutton" data-toggle="modal" data-target="#exampleModal">Friend Request</button>

                    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-sm" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 className="modal-title" id="exampleModalLabel">Friend invite sent!</h3>
                                </div>
                                <div className="modal-body">
                                    <p className="modal-title" id="exampleModalLabel">Check back later to see if they accept or decline.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        if (this.state.UserName === "") {
            return <>
                <h3 className="text-center mt-5">Loading...</h3>
            </>
        }
        else {
            return <>
                <div className=" pb-5">
                    <div className="titleStuff">
                        <div className="profilePic">
                            <img src={this.imageExists(this.state.ProfilePhotoURL) ? this.state.ProfilePhotoURL : 
                                "https://www.civhc.org/wp-content/uploads/2018/10/question-mark.png"} alt="ERROR" 
                                className="rounded-circle" height="200" width="200" />
                        </div>
                        <h2 className="usernameLabel font-weight-bold text-capitalize">{this.state.UserName}</h2>
                        <h4 className="companyName text-capitalize">{this.state.CompanyName}</h4>
                    </div>

                    <div className="row">
                        <div className="col">
                            <div className="m-2">
                                <Link to={"/dashboard/" + this.state.UserNameLooking} className="btn btn-primary buttonLink">Back to Dashboard</Link>
                            </div>
                        </div>
                        <div className="col">
                            <div className="m-2">
                                {this.buttonEdit()}
                            </div>
                        </div>
                    </div>

                    <div className="clearfix" />

                    <div className="row no-gutters">
                        <div className="col ">
                            <div className="bundleText BTLeft profilePage">
                                <p className="titles"><b>About Me:</b></p>
                                <p className="info">{this.state.AboutMe}</p>
                            </div>
                        </div>
                        <div className="col">

                            <div className="bundleText BTRight profilePage">
                                <p className="titles"><b >Name:</b> {this.state.FirstName + " " + this.state.LastName}</p>
                                <p className="titles"><b >Job Title:</b> {this.state.JobTitle}</p>
                                <p className="titles"><b >Location:</b> {this.state.Location}</p>
                                <p className="titles"><b >Phone:</b> {this.state.PhoneNumber}</p>
                                <p className="titles"><b >Email:</b> {this.state.EmailAddress}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }
    }

    componentDidMount() {
        let userLook = this.props.match.params.usernameLooking;
        if (userLook) {
            this.setState({ UserNameLooking: userLook });
        }

        let userPass = this.props.match.params.usernamePassed;
        if (userPass) {
            this.setState({ UserName: userPass });
        }

        if (userPass) {
            this.accountRepo.getUserInfo(userPass).then(account => {
                let accArray = account[0];
                if (accArray) {
                    if (accArray.firstName)
                        this.setState({ FirstName: accArray.firstName });

                    if (accArray.lastName)
                        this.setState({ LastName: accArray.lastName });

                    if (accArray.bio)
                        this.setState({ AboutMe: accArray.bio });

                    if (accArray.title)
                        this.setState({ JobTitle: accArray.title });

                    if (accArray.phone)
                        this.setState({ PhoneNumber: accArray.phone });

                    if (accArray.mail)
                        this.setState({ EmailAddress: accArray.mail });

                    if (accArray.picture)
                        this.setState({ ProfilePhotoURL: accArray.picture });
                }
            })
        }
    }
}