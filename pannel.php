<div id="pannel">
        <div class="bottom">
            <div id="compteur">No breed selected.</div>
            <button onclick="document.body.classList.toggle('open');" class="niceBtn">my list</button>
        </div>

        <div class="list">
            <div class="bigTitle">
                <h2>My list</h2> <div class="hr"></div>
            </div>

            <ul id="items"></ul>
        </div>
        
        <div class="saveList">
            <div class="bigTitle">
                <h2>Save your list</h2> <div class="hr"></div>
            </div>
    

            <div class="doubleContainer nameContainer">
                <div class="half">
                    <div class="fieldContainer">
                        <label for="name">What's your name?</label>
                        <input type="text" id="name" name="name" minlength="4" maxlength="20" size="10" placeholder="Michael">
                    </div>
                </div>

                <div class="half">
                    <button id="genLink" class="niceBtn">Generate link</button>
                </div>
            </div>


            <div class="doubleContainer linkContainer">
                <div class="half">
                    <div class="fieldContainer">
                        <label for="link">Here's your link!</label>
                        <input type="text" id="link" name="link">
                    </div>
                </div>

                <div class="half">
                    <button id="copyLink" class="niceBtn" onclick='copyLink()'>Copy link</button>
                </div>
            </div>

            <span id="error"></span>
            


            <div id="share">
                <div class="bigTitle">
                    <h2>Share your list</h2> <div class="hr"></div>
                </div>

                <div class="socialContainer">
                    <a target="_blank" class="socialBlock" id="twitterBlock">
                        <img src="http://localhost/~tahoe/myfavoritedogs/images/twitter.svg">
                        <span>Twitter</span>
                    </a>

                    <a target="_blank" class="socialBlock" id="facebookBlock">
                        <img src="http://localhost/~tahoe/myfavoritedogs/images/facebook.svg">
                        <span>Facebook</span>
                    </a>

                    <a target="_blank" class="socialBlock" id="telegramBlock">
                        <img src="http://localhost/~tahoe/myfavoritedogs/images/telegram.svg">
                        <span>Telegram</span>
                    </a>
                </div>
            </div>

            

            

        </div>
        
        
    </div>