(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
/**
 * @attribute currentAlbum
 * @desc stores album information
 */ 
        var currentAlbum = Fixtures.getAlbum();
/**
 * @desc Buzz object audio file
 * @type {Object}
 */
        var currentBuzzObject = null;
/**
 * @function setSong
 * @desc Stops currently playing song and loads new audio file as currentBuzzObject
 * @param {Object} song
 */
        var setSong = function(song) {
            if (currentBuzzObject) {
            stopSong(song);
        };
            
  /**
 * @desc Buzz object audio file
 * @type {Object}
 */
        currentBuzzObject = new buzz.sound(song.audioUrl, {
            formats: ['mp3'],
            preload: true
        });
            
        currentBuzzObject.bind('timeupdate', function() {
            $rootScope.$apply(function() {
                SongPlayer.currentTime = currentBuzzObject.getTime();
            });
        });

        SongPlayer.currentSong = song;
        };
/**
 * @function playSong
 * @desc Plays the current Buzz object and sets the playing property of the song to true
 * @param {Object} song
 */    
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        }
/**
 * @function stopSong
 * @desc Stops the current Buzz object and sets the playing property of the song to null
 * @param {Object} song
 */     
        var stopSong = function(song) {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing=null;
        }
/**
 * @function getSongIndex
 * @desc returns the index of the song
 * @param {Object} song
 */ 
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        SongPlayer.currentSong = null;
        
/**
* @desc Current playback time (in seconds) of currently playing song
* @type {Number}
*/
        SongPlayer.currentTime = null;
        
        SongPlayer.volume = 90;
/**
 * @method play
 * @desc If the current song is not the song that is selected, setSong and playSong are called on it. If the current song IS the song selected and if the currentBuzzObject is currently paused, the currentBuzzObject will then be played 
 * @param {Object} song
 */ 
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }
            }
        };
/**
 * @method pause
 * @desc Pauses the currentBuzzObject and sets the playing property of song to false
 * @param {Object} song
 */ 
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
/**
 * @method previous
 * @desc uses the currentSongIndex to move to the previous song
 */  
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            if (currentSongIndex < 0) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
/**
 * @method next
 * @desc uses the currentSongIndex to move to the next song
 */  
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            if (currentSongIndex <0) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
            };
        /**
* @function setCurrentTime
* @desc Set current time (in seconds) of currently playing song
* @param {Number} time
*/
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
            currentBuzzObject.setTime(time);
            }
        };
            
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
            SongPlayer.volume = volume;
        };
        
        SongPlayer.mute = function() {
            if(currentBuzzObject) {
                currentBuzzObject.toggleMute()
            } 
        };
        
    return SongPlayer;
        
    };
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();