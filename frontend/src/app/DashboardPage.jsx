import React, { useEffect, useState } from 'react';
import LoginPage from '../LoginPage';
import Post from './../models/Post';
import PostDisplay from './PostDisplay';
import {Link, useParams} from "react-router-dom";
import { PostsRepository } from '../api/PostRepository';
import { AccountsRepository } from '../api/AccountRepository';

export const DashboardPage = (props) => {
    const [posts, setPosts] = useState([]);
    const params = useParams();
    const postRepo = new PostsRepository();
    const accountRepo = new AccountsRepository();

    useEffect(() => {
        if(posts.length == 0){
            postRepo.getPosts().then((x,i) => {
                x.map(postDB => {
                    accountRepo.getCompanyByID(postDB.companyID).then( account =>
                        {
                            let companyName = account[0].companyName;
                            setPosts(posts => posts.concat(new Post(postDB.companyID, postDB.title, postDB.description, "", "", "", companyName, postDB.date)));
                        }
                    )
                });
            });
            postRepo.getMeetings().then((x,i) =>{
                x.map(meetDB => {
                    accountRepo.getCompanyByID(meetDB.hostCompanyID).then( account =>
                        {
                            if(account.length != 0){
                                console.log(meetDB);
                                let companyName = account[0].companyName;
                                setPosts(posts => posts.concat(new Post(meetDB.companyID, meetDB.Title, 
                                meetDB.description, meetDB.eventDate, meetDB.location, "", companyName, "")));
                            }
                        }
                    )
                });
            })
        }
    });

    if (posts.length == 0) {
        return <>
            <div className="colorBlue pb-5">
                <Link to={"/profile/" + params.username + "/" + params.username} className="btn btn-info float-right mr-3">Profile</Link>
                <Link to={"/" + params.username + "/createpost"} className="btn btn-success float-right mr-3">Create Post</Link>
            </div>
            <div className="clear-fix" />
            <div className="dashboardPage">
                <br></br>
                <center><h4>No posts to display.</h4></center>
            </div>
        </>
    } else {
        return <>
            <div className="colorBlue pb-5">
                <Link to={"/profile/" + params.username + "/" + params.username} className="btn btn-info float-right mr-3">Profile</Link>
                <Link to={"/" + params.username + "/createpost"} className="btn btn-success float-right mr-3">Create Post</Link>
            </div>
            <div className="clear-fix" />
            <div className="dashboardPage">
                {posts.map(x => 
                    <PostDisplay post={x} headerLink={true} userName={params.username}/>
                )}
            </div>
        </>
    }


}

export default DashboardPage;