const prompt = require('prompt-sync')();        // For taking user input
var s="[";                                      // String to store board states for each game

var mysql = require('mysql');
var con = mysql.createConnection(               // For making SQL connection
{                                               // Change the field values accordingly 
    host: "localhost",
    user: "root",
    password: "Fa*mysql12345",
    database: "minesDB"
});


function printBoard(ar)                         // Function to print board state after each move
{
    console.log("Board State:")
    s+='(';
    for(let i=0; i<5; i++)
    {
        console.log(ar[i].join(' | '));

        for(let j=0; j<5; j++) s+=ar[i][j];     // Update the string for board states
        s+=',';
    }
    s+='), ';
}

function addToTable(players, res, s, actualB)   // Function to Add an entry to the gameStates table in database for each game
{
    s+=']';
    con.connect(function(err) {                  
                     
        if (err) throw err;
        //console.log("Connected!");
      
        // Sql command to insert a row in the table
        var sql = "INSERT INTO gameStats (players, result, gameStates, actualBoard) VALUES (?,?,?,?)";
        let todo = [players, res, s, actualB];

        con.query(sql, todo,  (err, results, fields) => {
            if (err) throw err;
            //console.log("Values inserted");
        });
        con.end((error) => {                     
            if (error) {
                console.error('Error! closing MySQL connection:', error);
                return;
            }
        });
    });
}

function playGame()
{ 
    s="[";
    var players="";                             // String to store players names
    var res="";                                 // String to store game result
    var actualB="";                             // String to store actual state of board

    var n=5;                                    // Integer for Grid Size
    var mx=Math.floor((n*n)/2);                 // Maximum moves possible for a player
    var arr=[];                                 // array to store the board state
    var flag=false;                             // boolean value to indicate if game is over
    var pnum=1;                                 // integer to indicate which player's turn it is
    var cnt1=10,cnt2=10;                        // integers to store the number of moves of each player

    // Generates a mine at a random location
    const mineX = Math.floor(Math.random() * n);
    const mineY = Math.floor(Math.random() * n);
    console.log(mineX+1);  
    console.log(mineY+1);

    console.log();
    let player1 = prompt('Enter Player1 name: ');
    let player2 = prompt('Enter Player2 name: ');
    console.log();
    players= player1+ ' VS ' +player2;

    // Initialize the board with all tiles unopened
    for(let i=0; i<n; i++)
    {
        arr[i]=[];
        for(let j=0; j<n; j++)
        {
            arr[i][j]='?';
        }
    }

    printBoard(arr);

    // This loop runs until the game is over
    while(!flag)
    {
        if(pnum==1) console.log(`\n${player1}'s move:`);
        else if(pnum==2) console.log(`\n${player2}'s move:`);

        // Ask the player to enter the tile which they want to open
        let coordinates = prompt('Enter coordinates of tile to open: ');

        var t=coordinates.split(' ');
        if(t.length<2) 
        {
            if(t[0]=='exit') 
            {
                flag=true;
                console.log('\nExiting the game...\n');
                break;
            }
            console.log('!Invalid coordinates.');
            continue;
        }
        // Assign x the first input and y the second
        x=t[0];   y=t[1];
        x--;   y--;

        // Check if input is valid
        if(x>=n || y>=n || x<0 || y<0) 
        {
            console.log('!Invalid coordinates.');
            continue;
        }

        // Check if tile is already opened
        if(arr[x][y]!='?') 
        {
            console.log('Tile is already opened. Choose a different one.');
            continue;
        }
        
        // If the player opens a mine
        if(x==mineX && y==mineY)
        {
            console.log();
            if(pnum==1) console.log(`${player1} opened a mine. ${player2} wins!`);
            else if(pnum==2) console.log(`${player2} opened a mine. ${player1} wins!`);
            
            // Store the game result
            if(pnum==1)  res= player2 + ' wins.';
            else if(pnum==2)  res= player1 + ' wins.';

            arr[x][y] = 'M';

            s+='(';                                         // Update the string for board states
            for(let i=0; i<5; i++)
            {
                for(let j=0; j<5; j++) s+=arr[i][j];
                s+=',';
            }
            s+=')';

            // Show the board with all tiles opened
            for(let i=0; i<n; i++)
            {
                for(let j=0; j<n; j++)   arr[i][j]='G';
            }
            arr[x][y] = 'M';
            console.log("Actual Board:")
            
            actualB+='[';                                   // Store the actual board 
            for(let i=0; i<n; i++)
            {
                console.log(arr[i].join(' | '));
                for(let j=0; j<5; j++) actualB+=arr[i][j];
                actualB+=',';
            }
            actualB+=']';                                   
            console.log("\n---------- GAME OVER ----------");

            // Add the game information to the table in database
            addToTable(players, res, s, actualB);

            flag = true;
            break;
            // Exiting, since game is over
        }

        // increase the number of moves of the player 
        if (pnum == 1)    cnt1++;
        else              cnt2++;

        // The tile opened is a gem
        arr[x][y] = 'G'; 
        // Show the board state after opening of each tile
        printBoard(arr);

        // If only one tile remains and the tile containing the mine has not been opened yet
        if (cnt1 >= mx && cnt2 >= mx) 
        {
            console.log(`\nBoth players opened ${mx} tiles each. It's a draw!`);            
            res= 'Draw';                                    // Store the game reult

            s+='(';                                         // Update the string for board states
            for(let i=0; i<5; i++)
            {
                for(let j=0; j<5; j++) s+=arr[i][j];
                s+=',';
            }
            s+=')';

            // Show the board with all tiles opened
            for(let i=0; i<n; i++)
            {
                for(let j=0; j<n; j++)   arr[i][j]='G';
            }
            arr[mineX][mineY] = 'M';
            console.log("Actual Board:")

            actualB+='[';                                   // Store the actual board
            for(let i=0; i<n; i++)
            {
                console.log(arr[i].join(' | '));
                for(let j=0; j<5; j++) actualB+=arr[i][j];
                actualB+=',';
            }
            actualB+=']';
            console.log("\n---------- GAME OVER ----------");

            // Add the game information to the table in database
            addToTable(players, res, s, actualB);

            flag = true;
            break;
            // Exiting, since game is over
        }

        // Switch players turn
        pnum = pnum == 1 ? 2 : 1;       
    }
}


console.log("\n---------- MINES ----------");
console.log("\nGame Starts:-");

playGame();

return;

