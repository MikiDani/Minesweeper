<?php
$sql = "SELECT nickname, recordtime, tablesize, bombs, recorddate FROM score
        INNER JOIN users ON (score.userid = users.id)
        ORDER BY recorddate DESC";

$sqlquery = $conn->query($sql);
?>
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Highest Scrore</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">NickName</th>
                            <th scope="col">Time</th>
                            <th scope="col">Table</th>
                            <th scope="col">Bombs</th>
                            <th scope="col">RecordDate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            while ($row = $sqlquery->fetch_assoc()) {
                                $recorddate=substr_replace($row["recorddate"] ,"",-3);    
                                echo '<tr '.trdraw($row["nickname"]).'>';
                                echo '<td>'.nicknamedraw($row["nickname"]).'</td>
                                      <td>'.$row["recordtime"].'</td>
                                      <td>'.$row["tablesize"].'</td>
                                      <td class="text-center">'.$row["bombs"].'</td>
                                      <td class="text-center">'.$recorddate.'</td>
                                </tr>';
                            }
                        ?>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Contiune</button>
            </div>
        </div>
    </div>
</div>
<?php
    function nicknamedraw ($name) {
        if (isset($_COOKIE["user"])) {
            if ($_COOKIE["user"]==$name) {
                $returnname = "<strong class='text-warning'>".$name."</strong>";
            } else {
                $returnname = "<strong>".$name."</strong>";
            }
        } else { $returnname = "<strong>".$name."</strong>"; }
        return $returnname;
    }

    function trdraw($name) {
        if (isset($_COOKIE["user"])) {
            if ($_COOKIE["user"]==$name) {
                $trcolor = "class='bg-success'";
            } else {
                $trcolor = "";
            }
        } else { $trcolor = ""; }
        return $trcolor;
    }
?>