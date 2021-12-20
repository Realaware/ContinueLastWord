# Continuing Last Word
Simple game which can be played in discord.

# Built With
* [TypeScript](https://www.typescriptlang.org/)
* [Discord.js](https://discord.js.org)


# Set Up
Before start the bot, You should set bot token as yours.
then, Go <a href="https://krdict.korean.go.kr/openApi/openApiInfo">Korean Dictionary Api</a> and sign up.
and get your own api keys.

### Kkutu dictionary word validation
you can change your validation method to Kkutu api which allows you to use words used in general but not listed in above api.


# Playing
You can make queue using 'create-room' command. (with prefix)

# Rules
First randomly selected user can write any words existing in dictionary.
After first user write word, the next user must write word that starts with last character of lastly written word.

Example
```
First User: 자동차

Second User: 차고
...
```

In korean, There is an unique rule in its language structure called 두음법칙 (I specified it as TwoSoundRule in my code)
You can find out that explan about what is that rule. [Click Here](http://askakorean.blogspot.com/2013/02/grammar-rule-beginning-sound-rule.html)

anyways, I applied this rule to this game. any of character which can be transformed will be displayed as "Two Sound Rule Is Available"

# Road Map
- [ ] Add Custom Game
- [ ] Multi-language Support
    - [ ] English

# Contact
Discord: something good#6611
