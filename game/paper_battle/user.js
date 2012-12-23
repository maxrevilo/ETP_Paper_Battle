define(['class', 'utils'],
function(Class, Utils) {

var NAMES = ['Oliver', 'Anke', 'Stefan', 'Stephan', 'David', 'Lea', 'Thomas', 'Birgit', 'Gabriele', 'Brigitte', 'Daniel', 'Mathias', 'Matthias', 'Martina', 'Uta', 'Ute', 'Ursula', 'Janina', 'Dennis', 'Mike', 'Maik', 'Alexander', 'Peter', 'Melanie', 'Dieter', 'Jan', 'Marie', 'Sara', 'Sarah', 'Robert', 'Andrea', 'Christin', 'Christian', 'Mandy', 'Ulrich', 'Simone', 'Maximilian', 'Diana', 'Sebastian', 'Sophia', 'Sophie', 'Karin', 'Markus', 'Kristin', 'Jürgen', 'Benjamin', 'Yvonne', 'Antje', 'Eric', 'Erik', 'Heike', 'Sandra', 'Claudia', 'Ines', 'Uwe', 'Vanessa', 'Felix', 'Kerstin', 'Andreas', 'Barbara', 'Sven', 'Swen', 'Nadine', 'Florian', 'Sabrina', 'Paul', 'Angelika', 'Katharina', 'Jonas', 'Jörg', 'Jana', 'Nicole', 'Sabine', 'Maria', 'Anja', 'Wolfgang', 'Michael', 'Patrick', 'Lisa', 'Monika', 'René', 'Christina', 'Christine', 'Tim', 'Lena', 'Philipp', 'Phillipp', 'Marcel', 'Jessica', 'Jessika', 'Max', 'Kathrin', 'Katrin', 'Silke', 'Juliane', 'Klaudia', 'Franziska', 'Kevin', 'Katja', 'Daniela', 'Doreen', 'Dominik', 'Bernd', 'Klaus', 'Steffen', 'Tobias', 'Frank', 'Jens', 'Leon', 'Stefanie', 'Stephanie', 'Thorsten', 'Torsten', 'Niklas', 'Tom', 'Ulrike', 'Laura', 'Kristian', 'Ralf', 'Ralph', 'Manuela', 'Dirk', 'Karolin', 'Jennifer', 'Tanja', 'Petra', 'Lukas', 'Susanne', 'Marco', 'Marko', 'Annett', 'Martin', 'Julia', 'Mario', 'Marina', 'Anna', 'Anne']
    .sort(function(){return Math.random() > 0.5;}),
    NAME_I = 0;

var User = Class.extend({
    level: {
        number: 0,
        experience: 0
    },

    session: {
        start: 0,
        kills: 0,
        deaths: 0,
        experience: 0,

        driver: null,
        socket: null
    },

    profile: {
        username: null,
        creation_date: 0,
        kills: 0,
        deaths: 0,
        experience: 0,
        matus_lifes: 0
    },

    skill_points: {
        free    : 0,

        max_mana: 0,
        mana_reg: 0,
        speed   : 0,
        life    : 0,
        life_reg: 0,

        fire_atk: 0,
        fire_res: 0,
        ice_atk : 0,
        ice_res : 0
    },

    init: function() {
        this.level = Utils.clone(this.level);
        this.session = Utils.clone(this.session);
        this.profile = Utils.clone(this.profile);
        this.skill_points = Utils.clone(this.skill_points);

        this.profile.username = NAMES[NAME_I++];
    },

    handicap: function() {
        return this.session.experience - this.session.deaths*150;
    }
});

return User;

});