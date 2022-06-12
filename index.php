<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="img/favicon.png" type="image/x-icon">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="style.css">
    <title>Minesweeper</title>
</head>
<body>
    <?php
    session_start();
    if (!isset($_SESSION["userbuttonsubmit"])) {
        $_SESSION["userbuttonsubmit"] = false;
    }
    include_once("php/connect.php");

    $logininputs = ["loginnameoremail", "loginpassword", "loginerrormessage"];
    $registrationinputs = ["registrationname", "registrationemail", "registrationpassword1", "registrationpassword2", "registrationerrormessage"];

    firstchecksessioninputs($logininputs);
    firstchecksessioninputs($registrationinputs);

    // WIN
    if (isset($_POST["winsubmit"])) {
        if (isset($_COOKIE["user"])) {
            $recordtime = $_POST["time"];
            $recordtable = $_POST["table"];
            $recordbombs = $_POST["bomb"];
            $recorddate = date("Y-m-d H:i:s");
            $nickname = $_COOKIE["user"];

            $sqluser = "SELECT id FROM users WHERE nickname = '$nickname'";
            $sqluserquery = $conn->query($sqluser);
            $id = ($sqluserquery->fetch_row());
            $userid = $id[0];

            $sql2 = "SELECT score.id as azid, nickname, tablesize, bombs, recordtime FROM score
                 INNER JOIN users ON (score.userid = users.id)";
            $sqlquery2 = $conn->query($sql2);

            $check = false;
            while ($row = $sqlquery2->fetch_assoc()) {
                if ($row["nickname"] == $nickname && $row["tablesize"] == $recordtable && $row["bombs"] == $recordbombs) {
                    $check = true;
                    $updateid = $row["azid"];
                    $sqlupdate = "UPDATE score SET recordtime=$recordtime, recorddate='$recorddate' 
                              WHERE id=$updateid";
                    if ($conn->query($sqlupdate) === TRUE) {
                        header("Location: index.php");
                    } else {
                        echo "Error: " . $conn->error . "<br>";
                    }
                }
            }
            if ($check == false) {
                $sql = "INSERT INTO score (userid, recordtime, recorddate, tablesize, bombs) VALUES ('$userid', '$recordtime', '$recorddate', '$recordtable', '$recordbombs')";
                if ($conn->query($sql) === TRUE) {
                    header("Location: index.php");
                } else {
                    echo "Error: " . $conn->error . "<br>";
                }
            }
        }
    }

    // LOGIN
    if (isset($_POST["loginsubmit"])) {
        inputsvaluestopass($logininputs);
        if ($_SESSION["loginnameoremail"] != "" && $_SESSION["loginpassword"] != "") {
            $sql = "SELECT id, nickname, email, userpassword FROM users";
            $sqlquery = $conn->query($sql);
            $find = false;
            while ($data = $sqlquery->fetch_assoc()) {
                if (($_SESSION["loginnameoremail"] == $data["nickname"] || $_SESSION["loginnameoremail"] == $data["email"]) && $_SESSION["loginpassword"] == $data["userpassword"]) {
                    setcookie("user", $data["nickname"], time() + 2000);
                    inputsvaluesempty($logininputs);
                    inputsvaluesempty($registrationinputs);
                    $_SESSION["userbuttonsubmit"] = false;
                    $find = true;
                    header("Location: index.php");
                }
            }
            if ($find == false) {
                $_SESSION['loginerrormessage'] = "Incorrect login!";
            }
        } else {
            $_SESSION['loginerrormessage'] = "Fields are required!";
        }
    }

    // LOG OUT
    if (isset($_POST["logoutsubmit"])) {
        if (isset($_COOKIE["user"])) {
            setcookie("user", $_COOKIE["user"], time() - 2000);
            $_SESSION["userbuttonsubmit"] = false;
            inputsvaluesempty($logininputs);
            header("Location: index.php");
        }
    }

    // DELETE PROFIL
    if (isset($_POST["deleteprofil"])) {
        if (isset($_COOKIE["user"])) {
            $username = $_COOKIE["user"];
            $sql = "DELETE FROM users WHERE nickname = '$username'";
            if ($conn->query($sql) === TRUE) {
                setcookie("user", $_COOKIE["user"], time() - 2000);
                $_SESSION["userbuttonsubmit"] = false;
                header("Location: index.php");
            } else {
                echo $conn->error;
            }
        }
    }

    // REGISTRATION
    if (isset($_POST["registrationsubmit"])) {
        inputsvaluestopass($registrationinputs);

        $sql = "SELECT nickname, email FROM users";
        $sqlquery = $conn->query($sql);
        $done = true;

        $_SESSION["registrationerrormessage"] = "";

        if ($_SESSION["registrationname"] == "" || $_SESSION["registrationemail"] == "" || $_SESSION["registrationpassword1"] == "" || $_SESSION["registrationpassword2"] == "") {
            $done = false;
            $_SESSION["registrationerrormessage"] .= "Fields are required!<br>";
        }

        while ($data = $sqlquery->fetch_assoc()) {
            if ($data["nickname"] == $_SESSION["registrationname"]) {
                $done = false;
                $_SESSION["registrationerrormessage"] .= "The Nickname is registered!<br>";
            }
            if ($data["email"] == $_SESSION["registrationemail"]) {
                $done = false;
                $_SESSION["registrationerrormessage"] .= "The email is registered!<br>";
            }
        }

        if ($_SESSION["registrationpassword1"] != $_SESSION["registrationpassword2"]) {
            $done = false;
            $_SESSION["registrationerrormessage"] .= "Passwords do not match!<br>";
        }
        if (strlen($_SESSION["registrationpassword1"]) < 6) {
            $done = false;
            $_SESSION["registrationerrormessage"] .= "Passwords minimum length is 6 characters.<br>";
        }

        if ($done) {
            $registrationname = $_SESSION["registrationname"];
            $registrationemail = $_SESSION["registrationemail"];
            $registrationpassword = $_SESSION["registrationpassword1"];
            $registrationdate = date("Y-m-d H:i:s");
            $sql = "INSERT INTO users (nickname, email, userpassword, registrationdate) VALUES ('$registrationname', '$registrationemail', '$registrationpassword', '$registrationdate')";
            if ($conn->query($sql) === TRUE) {
                setcookie("user", $registrationname, time() + 2000);
                $_SESSION["userbuttonsubmit"] = false;
                inputsvaluesempty($registrationinputs);
                header("Location: index.php");
            } else {
                echo "Error: " . $conn->error . "<br>";
            }
        }
    }

    // USERLINE SWITCH
    if (isset($_POST["userbuttonsubmit"])) {
        if ($_SESSION["userbuttonsubmit"] == true) {
            $_SESSION["userbuttonsubmit"] = false;
        } else {
            $_SESSION["userbuttonsubmit"] = true;
        }
    }
    ?>
    <div class="container-fluid bg-dark">
        <h3 class="border-bottom border-2 border-secondary pt-2 text-center text-info">Minesweeper</h3>
        <div class="row playerhead bg-secondary">
            <div class="col-6 text-start pt-2 pb-2">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Scores</button>
            </div>
            <div class="col-6 text-end pt-2 pb-2">
                <?php
                if (isset($_COOKIE["user"])) {
                ?>
                <form action="index.php" method="post">
                    <div class="dropdown">
                        <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><?php echo $_COOKIE["user"] . " "; ?></button>
                            <ul class="dropdown-menu text-center" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <form action="index.php" method="post">
                                    <input type="hidden" name="username" value="<?php echo $_COOKIE["user"]; ?>">
                                    <a class="dropdown-item"><button type="submit" name="deleteprofil" class="btn btn-danger btn-sm">Delete Profil</button></a>
                                </form>
                            </li>
                            <li><a class="dropdown-item"><button type="submit" name="logoutsubmit" class="btn btn-primary btn-sm">Log Out</button></a></li>
                        </ul>
                    </div>
                </form>
                <?php
                } else {
                ?>
                    <form action="index.php" method="post">
                        <button type="submit" name="userbuttonsubmit" class="btn btn-primary">Log in</button>
                    </form>
                <?php
                }
                ?>
            </div>
        </div>
        <?php if ($_SESSION["userbuttonsubmit"]) {
            include_once("php/user.php");
        } ?>
        <div class="row text-center justify-content-center mt-2">
            <div class="col-4 text-end pb-2 pe-5">
                <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="true" aria-controls="collapseExample">OPTIONS</button>
            </div>
            <div class="col-4 text-center pb-2" id="smiley"></div>
            <div class="col-4 text-start pb-2 ps-5"><button id="help-button" class="btn btn-light"></button></div>
        </div>
        <?php include_once("php/higestscores.php"); ?>
        <div class="row options">
            <div class="collapse" id="collapseExample">
                <div class="card bg-secondary mb-3">
                    <div class="row">
                        <h3 class="text-center my-4"><strong>Table options:</strong></h3>
                        <div class="row mb-1 text-center" id="tableY">
                            <label class="col-3 text-end">table Y:</label>
                            <div class="col-6">
                                <input name="tabley" type="range" class="form-range" min="10" max="30" step="1">
                            </div>
                            <label class="col-3 indicator text-start"></label>
                        </div>
                        <div class="row mb-1" id="tableX">
                            <label class="col-3 text-end">table X:</label>
                            <div class="col-6">
                                <input name="tablex" type="range" class="form-range" min="10" max="30" step="1">
                            </div>
                            <label class="col-3 indicator text-start"></label>
                        </div>
                        <div class="row mb-1 text-center" id="mines">
                            <label class="col-3 text-end">bombs:</label>
                            <div class="col-6">
                                <input name="firstmines" type="range" class="form-range" min="15" step="1">
                            </div>
                            <label class="col-3 indicator text-start"></label>
                        </div>
                        <hr>
                        <div class="col-12 form-check form-check-inline text-center">
                            <label class="form-check-label text-center mb-3" for="inlineRadio1"><strong>Helps:</strong></label>
                        </div>
                        <div class="col-12 mb-2 text-center">
                            <div class="col-2 form-check form-check-inline text-start">
                                <label class="form-check-label" for="inlineRadio1">0.</label>
                                <input class="form-check-input" type="radio" name="helpradio" id="radio0" value="0">
                            </div>
                            <div class="col-2 form-check form-check-inline text-start">
                                <label class="form-check-label" for="inlineRadio1">1.</label>
                                <input class="form-check-input" type="radio" name="helpradio" id="radio1" value="1">
                            </div>
                            <div class="col-2 form-check form-check-inline text-start">
                                <label class="form-check-label text-start" for="inlineRadio2">2.</label>
                                <input checked="true" class="form-check-input" type="radio" name="helpradio" id="radio2" value="2">
                            </div>
                            <div class="col-2 form-check form-check-inline text-start">
                                <label class="form-check-label text-start" for="inlineRadio3">3.</label>
                                <input class="form-check-input" type="radio" name="helpradio" id="radio3" value="3">
                            </div>
                        </div>
                        <hr>
                        <div class="mb-2 text-center">
                            <button id="generate-button" type="button" class="btn btn-info">Generate</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="gamearea">
            <div id="gametable" class="gametable pb-3"></div>
            <form method="POST" action="index.php">
                <div id="windiv" class="text-warning text-center mb-3">
                    <?php if (isset($_COOKIE["user"])) { ?>
                        <span><?php echo $_COOKIE["user"] . " "; ?>you Won!</span>
                        <p id="wintext"></p>
                        <span><button type="submit" name="winsubmit" class="btn btn-warning">OK!</button></span>
                    <?php } else { ?>
                        <span>You Won!</span>
                        <span id="wintext"></span>
                    <?php } ?>
                </div>
            </form>

            <div class="row bg-secondary text-center">
                <div class="col-4 bombs"><img width="20%" max-width="100px" src="img/bomb.svg">
                    <h4 class="bomb-text"></h4>
                </div>
                <div class="col-4 mt-3"><img id="sound-switch" width="20%" src="img/soundon.svg"></div>
                <div class="col-4"><img width="20%" src="img/clock.svg">
                    <h4 class="time-text"></h4>
                </div>
            </div>
        </div>
    </div>
    <div id="audios"></div>
    <script src="options.js"></script>
    <script src="game.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossorigin="anonymous"></script>
</body>

</html>

<?php
function firstchecksessioninputs($inputs)
{
    for ($n = 0; $n < count($inputs); $n++) {
        if (!isset($_SESSION[$inputs[$n]])) {
            $_SESSION[$inputs[$n]] = "";
        }
    }
}

function inputsvaluestopass($inputs)
{
    for ($n = 0; $n < count($inputs); $n++) {
        if (isset($_POST[$inputs[$n]])) {
            $_SESSION[$inputs[$n]] = $_POST[$inputs[$n]];
        }
    }
}

function inputsvaluesempty($inputs)
{
    for ($n = 0; $n < count($inputs); $n++) {
        if (isset($_POST[$inputs[$n]])) {
            $_SESSION[$inputs[$n]] = null;
        }
    }
}
?>