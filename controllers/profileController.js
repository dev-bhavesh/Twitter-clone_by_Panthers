const conn = require('../connection/connectdb');

const express = require('express')
const app = express();
const util = require('util')
const asyncHandler = require("express-async-handler");
const session = require('express-session');
var query = util.promisify(conn.query).bind(conn)

async function queryExecuter(query) {
    return new Promise((resolve, rejects) => {
        conn.query(query, (err, result) => {
            if (err) {
                rejects(err);
            }
            resolve(result);
        });
    })
}

const getProfiledata = asyncHandler(async (req, res) => {
    //i need to show the get request for register page
    let user_id = req.session.user_id
    var users = await query(`select * from users where id=${user_id}`);

    res.json(users)
    // let flag = false
});
const editprofile = asyncHandler(async (req, res) => {
    //i need to show the get request for register page
    let user_id = req.session.user_id
    var users = await query(`select * from users where id=${user_id}`);

    res.json(users)
    // let flag = false
});
const getProfile = asyncHandler(async (req, res) => {

    //i need to show the get request for register page
    let db = `twitter_clone`;
    try {
        const token = req.session.email
        if (!token) {
            res.redirect('/user-login')
        }
        const user_id = req.session.user_id
        // let sel_q = `SELECT id,name,user_image,user_name FROM   users `;
        let sel_tweets = `select * from tweets where user_id=${user_id} order by id DESC`;
        const all_tweet_data = await query(sel_tweets);
        // for retweet
        let sel_retweets = `SELECT * FROM twitter_clone.retweet inner join twitter_clone.tweets on retweet.tweet_id=tweets.id where retweet.user_id='${user_id}'AND retweet.is_deleted='0' order by retweet.id DESC`;
        const all_retweet_data = await query(sel_retweets);


        // //for retweet 
        // let sel_retweets = `SELECT * FROM twitter_clone.retweet inner join twitter_clone.tweets on retweet.tweet_id = tweets.id where retweet.user_id = '${user_id}'AND retweet.is_deleted = '0' order by retweet.id DESC`;
        // const all_retweet_data = await query(sel_retweets);

        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let post_at = []
        //set month name and date
        all_tweet_data.forEach((tweet) => {
            const d = new Date(tweet.created_at);
            const d2 = new Date()

            const diffTime = Math.abs(d2 - d);
            const diffYears = ((d2.getFullYear() - d.getFullYear()) != 0) ? true : false;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            const diffMinutes = Math.ceil(diffTime / (1000 * 60));

            function addZero(i) {
                if (i < 10) { i = "0" + i }
                return i;
            }

            if (diffMinutes < 60) {
                post_at.push(`${diffMinutes} Minutes ago`)
            }
            else if (diffHours < 24) {
                post_at.push(`${diffHours} Hours ago`)
            }
            else if (diffDays < 5) {
                // if (diffHours > 24) {
                const days = Math.floor(diffHours / 24)
                const hours = Math.ceil(diffHours % 24)
                post_at.push(`${days}d ${hours}h ago`)
                // }
            }
            else {
                let is_am_pm = "AM"
                let hours = d.getHours()
                if (hours >= 12) {
                    is_am_pm = "PM"
                    hours = hours - 12;
                }
                if (diffYears) {
                    post_at.push(`${hours}:${d.getMinutes()} ${is_am_pm} • ${month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`)
                } else {
                    post_at.push(`${hours}:${d.getMinutes()} ${is_am_pm} • ${month[d.getMonth()]} ${d.getDate()}`)

                }
            }
        })


        const alltweetids = `select id from tweets where user_id=${user_id}`
        const alltweet_ids = await queryExecuter(alltweetids);

        let value = alltweet_ids.length
        var arr_of_liked = []
        var done = []
        for (let i = 0; i < value; i++) {

            const qrt = `SELECT *  FROM  likes where tweet_id=${alltweet_ids[i].id} and user_id=${user_id} and is_deleted=0;`

            const likeddata = await queryExecuter(qrt);
            arr_of_liked[i] = likeddata

        }

        let ispostlikebyuser = []
        ispostlikebyuser = arr_of_liked
        let arrtruefalse = []
        let arrlikeid = [];
        for (let j = 0; j < ispostlikebyuser.length; j++) {
            if (ispostlikebyuser[j].length) {
                let flaga = true
                arrtruefalse.push(flaga)

                var userlikedpost = ispostlikebyuser[j][0].tweet_id
                arrlikeid.push(userlikedpost)

            }
            else {
                let flaga = false
                arrtruefalse.push(flaga)
            }

        }
        let some = alltweet_ids.length
        var arr_of_retweet = [];

        for (let i = 0; i < some; i++) {

            const qrt = `SELECT *  FROM retweet where tweet_id=${alltweet_ids[i].id} and user_id=${user_id} and is_deleted=0;`

            const retweetdata = await queryExecuter(qrt);
            arr_of_retweet[i] = retweetdata

        }

        let ispostretweetbyuser = []
        ispostretweetbyuser = arr_of_retweet
        let arrretweetid = [];
        for (let j = 0; j < ispostretweetbyuser.length; j++) {
            if (ispostretweetbyuser[j].length) {

                var userretweetpost = ispostretweetbyuser[j][0].tweet_id
                arrretweetid.push(userretweetpost)

            }
        }

        var users = await query(`select * from users where id=${user_id}`);
        let followuser = await queryExecuter(`select * from users where id not in(${user_id}) limit 3`)
        var getfollowerId = await queryExecuter(`select follower_id from followers where user_id =${user_id}`);

        for (let b = 0; b < all_retweet_data.length; b++) {
            var twt_user = await query(`SELECT * FROM twitter_clone.retweet inner join twitter_clone.tweets on retweet.tweet_id=tweets.id inner join twitter_clone.users on tweets.user_id=users.id where retweet.user_id='${user_id}' AND retweet.is_deleted='0' order by retweet.id DESC `);
        }

        //i need to show the get request for register page
        let changepass = false
        res.render('profile', { twt_user: twt_user, all_retweet: all_retweet_data, tweet_data: all_tweet_data, post_date: post_at, arrlikeid, arrretweetid, users, changepass, fuser: followuser, followers: getfollowerId });

    } catch (err) {
        console.log("Error Dashboard:", err);
    }


});

const updateProfilepoint = asyncHandler(async (req, res) => {
    try {
        const arr = { name, user_email, user_bio, user_dob } = req.body;
        console.log(arr);

        try {
            let uid = req.query.uid || 3;
            const file = req.files;
            var users = await query(`select user_image as dp , cover_image as cover from users where id=${uid}`);

            var cover_imgsrc = req.files.cover_image;
            var profile_imgsrc = req.files.profile_image;

            if (cover_imgsrc) {
                cover_imgsrc = '/uploads/' + file.cover_image[0].filename;
            } else {
                cover_imgsrc = users[0].cover;
            }

            if (profile_imgsrc) {
                profile_imgsrc = '/uploads/' + file.profile_image[0].filename
            } else {
                profile_imgsrc = users[0].dp
            }




            await query(`update users set  bio="${user_bio}" ,birth_date="${user_dob}" ,cover_image="${cover_imgsrc}", user_image="${profile_imgsrc}" WHERE id=${uid}`);
            res.redirect("prof")


        } catch (error) {
            throw error;
        }


    } catch (error) {
        throw error;
    }
})


const getUserInfo = asyncHandler(async (req, res) => {
    let userId = req.session.user_id;

    let user = await queryExecuter(`SELECT name,user_name,user_image from users WHERE id = ${userId}`)
    res.json({ name: user[0].name, username: user[0].user_name, user_img: user[0].user_image })
})


const getTagetProfiledata = async (req, res) => {


    let db = `twitter_clone`;
    try {
        const token = req.session.email
        if (!token) {
            res.redirect('/user-login')
        }
        let user_id = req.query.id;
        console.log(user_id);




    } catch (err) {
        console.log("Error Dashboard:", err);
    }
    return res.json({ msg: "success" });


}






const getTargetProfile = asyncHandler(async (req, res) => {
    let db = `twitter_clone`;
    try {
        const token = req.session.email
        if (!token) {
            res.redirect('/user-login')
        }
        let user_id = req.params.id;
        let sel_tweets = `select * from tweets where user_id=${user_id} order by id DESC`;
        const all_tweet_data = await query(sel_tweets);



        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let post_at = []
        //set month name and date
        all_tweet_data.forEach((tweet) => {
            const d = new Date(tweet.created_at);
            const d2 = new Date()

            const diffTime = Math.abs(d2 - d);
            const diffYears = ((d2.getFullYear() - d.getFullYear()) != 0) ? true : false;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
            const diffMinutes = Math.ceil(diffTime / (1000 * 60));

            function addZero(i) {
                if (i < 10) { i = "0" + i }
                return i;
            }

            if (diffMinutes < 60) {
                post_at.push(`${diffMinutes} Minutes ago`)
            }
            else if (diffHours < 24) {
                post_at.push(`${diffHours} Hours ago`)
            }
            else if (diffDays < 5) {
                // if (diffHours > 24) {
                const days = Math.floor(diffHours / 24)
                const hours = Math.ceil(diffHours % 24)
                post_at.push(`${days}d ${hours}h ago`)
                // }
            }
            else {
                let is_am_pm = "AM"
                let hours = d.getHours()
                if (hours >= 12) {
                    is_am_pm = "PM"
                    hours = hours - 12;
                }
                if (diffYears) {


                    post_at.push(`${hours}:${d.getMinutes()} ${is_am_pm} • ${month[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`)
                } else {
                    post_at.push(`${hours}:${d.getMinutes()} ${is_am_pm} • ${month[d.getMonth()]} ${d.getDate()}`)

                }
            }
        })


        var uid = req.session.user_id
        const alltweetids = `select id from tweets where user_id=${user_id}`
        const alltweet_ids = await queryExecuter(alltweetids);

        let value = alltweet_ids.length
        var arr_of_liked = []
        var done = []
        for (let i = 0; i < value; i++) {

            const qrt = `SELECT *  FROM  likes where tweet_id=${alltweet_ids[i].id} and user_id=${uid} and is_deleted=0;`

            const likeddata = await queryExecuter(qrt);
            arr_of_liked[i] = likeddata

        }

        let ispostlikebyuser = []
        ispostlikebyuser = arr_of_liked
        let arrtruefalse = []
        let arrlikeid = [];
        for (let j = 0; j < ispostlikebyuser.length; j++) {
            if (ispostlikebyuser[j].length) {
                let flaga = true
                arrtruefalse.push(flaga)

                var userlikedpost = ispostlikebyuser[j][0].tweet_id
                arrlikeid.push(userlikedpost)

            }
            else {
                let flaga = false
                arrtruefalse.push(flaga)
            }

        }

        let some = alltweet_ids.length
        var arr_of_retweet = [];

        for (let i = 0; i < some; i++) {

            const qrt = `SELECT *  FROM retweet where tweet_id=${alltweet_ids[i].id} and user_id=${uid} and is_deleted=0;`

            const retweetdata = await queryExecuter(qrt);
            arr_of_retweet[i] = retweetdata

        }

        let ispostretweetbyuser = []
        ispostretweetbyuser = arr_of_retweet
        let arrretweetid = [];
        for (let j = 0; j < ispostretweetbyuser.length; j++) {
            if (ispostretweetbyuser[j].length) {

                var userretweetpost = ispostretweetbyuser[j][0].tweet_id
                arrretweetid.push(userretweetpost)

            }
        }


        var users = await query(`select * from users where id=${user_id}`);
        let followuser = await queryExecuter(`select * from users where id not in(${user_id}) limit 3`)
        var getfollowerId = await queryExecuter(`select follower_id from followers where user_id =${user_id}`);

        //for retweet
        let sel_retweets = `SELECT * FROM twitter_clone.retweet inner join twitter_clone.tweets on retweet.tweet_id = tweets.id where retweet.user_id = '${user_id}'AND retweet.is_deleted = '0' order by retweet.id DESC`;
        const all_retweet_data = await query(sel_retweets);


        for (let b = 0; b < all_retweet_data.length; b++) {
            var twt_user = await query(`SELECT * FROM twitter_clone.retweet inner join twitter_clone.tweets on retweet.tweet_id=tweets.id inner join twitter_clone.users on tweets.user_id=users.id where retweet.user_id='${user_id}' AND retweet.is_deleted='0' order by retweet.id DESC `);
        }

        res.render('targetProfile', { twt_user: twt_user, all_retweet: all_retweet_data, tweet_data: all_tweet_data, post_date: post_at, arrlikeid, users, arrretweetid, fuser: followuser, followers: getfollowerId })

    }
    catch (err) {
        return err
    }
})




// app.get("/user-dash",async(req,res)=>{
const fflist = asyncHandler(async (req, res) => {
    let user_idd=req.session.user_id;
    console.log("user id profile="+user_idd);

    let uid = req.params.id || user_idd;

    let user_id = req.params.id;
    console.log("user id in controller="+user_id);
    console.log("uid in controller="+uid);
    var getuser = await queryExecuter(`select id,name,user_name,user_image,cover_image,birth_date,bio,email from users where id not in(${uid})`);
    var getfollowerId = await queryExecuter(`select follower_id from followers where user_id =${uid}`);
    var followers = [];
    getfollowerId.forEach(id => {
        followers.push(id.follower_id);
    });
    var following = await queryExecuter(`select users.id,users.name,users.user_name,users.user_image from users left join following on users.id = following.user_id where following_id = ${uid}`)

    var follower = await queryExecuter(`select users.id,users.name,users.user_name,users.user_image from users left join followers on users.id = followers.user_id where follower_id = ${uid}`)

    // console.log("Getfollowerid fflist:::::::", follower);
    res.render('follow_following', { fuser: getuser, followers, following, follower })
})


module.exports = { fflist,getProfile, getProfiledata, updateProfilepoint, editprofile, getUserInfo, getTagetProfiledata, getTargetProfile }