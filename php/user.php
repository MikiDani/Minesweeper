<div class="row userpanel">

    <div class="col-6 bg-secondary p-3 mt-2">
        <form method="post" action="index.php">
            <div class="col-12 text-center text-warning"><h3>Login</h3></div>
            <div class="form-group">
                <label>Name or email:</label>
                <input type="text" class="form-control" name="loginnameoremail" placeholder="Name or email" value="<?php echo $_SESSION["loginnameoremail"]; ?>">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control mb-2" name="loginpassword" placeholder="Password" value="<?php echo $_SESSION["loginpassword"]; ?>">
            </div>
            <div id="loginerrormessage" class="form-text text-warning"><?php echo $_SESSION["loginerrormessage"]; ?></div>
            <button type="submit" name="loginsubmit" class="btn btn-success mt-2">Login</button>
        </form>
    </div>

    <div class="col-6 bg-secondary p-3 mt-2">
        <form method="post" action="index.php">
            <div class="col-12 text-center text-warning"><h3>Registration</h3></div>
            <div class="form-group">
                <label>Name:</label>
                <input type="text" class="form-control" name="registrationname" placeholder="Name" value="<?php echo $_SESSION["registrationname"]; ?>">
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" class="form-control" name="registrationemail" placeholder="Email" value="<?php echo $_SESSION["registrationemail"]; ?>">
            </div>
            <div class="form-group">
                <label>Password:</label>
                <input type="password" class="form-control" name="registrationpassword1" placeholder="Password" value="<?php echo $_SESSION["registrationpassword1"]; ?>">
            </div>
            <div class="form-group">
                <label>Repeat password:</label>
                <input type="password" class="form-control mb-2" name="registrationpassword2" placeholder="Repeat password" value="<?php echo $_SESSION["registrationpassword2"]; ?>">
            </div>
            <div id="registrationerrormessage" class="form-text text-warning"><?php echo $_SESSION["registrationerrormessage"]; ?></div>
            <button type="submit" name="registrationsubmit" class="btn btn-warning mt-2">Registration</button>
        </form>
    </div>

</div>
<?php 
$_SESSION["loginerrormessage"]="";
$_SESSION["registrationerrormessage"]="";
?>