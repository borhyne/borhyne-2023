---
layout: page
title: Music
permalink: /music/
---
This is a work in progress. Let me know if there are songs you think I should add [recommendations](https://forms.gle/CNwTc8xPk3tQ4UUS9)

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Music Player</title>
  <link rel="stylesheet" href="styles.css">
</head>

<body>
  <div id="app">
    <div id="controls">
      <select id="song-dropdown"></select>
      <button id="play-button">Play</button>
      <input type="range" min="30" max="200" value="120" id="bpm-slider">
      <label id="bpm-label">BPM: 120</label>
    </div>
    <div id="column-labels"></div>
    <div id="grid"></div>
  </div>
  <script src="script.js"></script>
</body>

</html>
