<?php
$db = new SQLite3('vermontmusic.db');

if (!$db) {
    die("Connection failed");
}
echo "Connected successfully";

$result = $db->query("SELECT * FROM posts")
?>


<!DOCTYPE HTML>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Venues</title>
    </head>
    <body>
        <main>
            <h1>Venues</h1>
            <div >
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2847.2597024889474!2d-73.17819002391421!3d44.46884917107517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cca7a3025d69433%3A0x89fadcee983456c3!2sHigher%20Ground!5e0!3m2!1sen!2sus!4v1772484849486!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <?php while ($row = $result->fetchArray(SQLITE3_ASSOC)): ?>
                <tr>
                    <td><?= $row["userID"] ?><?= $row["review"] ?></td>
                    <td><?= $row["text"] ?></td>
                </tr>
            <?php endwhile; ?>
        </main>
    </body>
</html>
