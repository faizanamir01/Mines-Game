const prompt = require('prompt-sync')();

var mysql = require('mysql');
var s="[";
var players="";
var res="";

var con = mysql.createConnection(
{
    host: "localhost",
    user: "root",
    password: "Fa*mysql12345",
    database: "minesDB"
});

function printBoard(ar) 
{
    console.log("Board State:")
    s+='(';
    for(let i=0; i<5; i++)
    {
        console.log(ar[i].join(' | '));

        for(let j=0; j<5; j++) s+=ar[i][j];
        s+=',';
    }
    s+='), ';
}

function addToTable() 
{
    s+=']';
    // console.log(s);
    // console.log(actualB);
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
      
        var sql = "INSERT INTO gameStats (players, result, gameStates, actualBoard) VALUES (?,?,?,?)";
        let todo = [players, res, s, actualB];

        // // execute the insert statment
        // connection.query(sql, todo, (err, results, fields) => {
        //     if (err) return console.error(err.message);

        //     console.log('Todo Id:' + results.insertId);
        // });
        con.query(sql, todo,  (err, results, fields) => 
        {
            if (err) throw err;
            console.log("Values inserted");
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
    var n=5;
    s="[";
    actualB="";
    players="";
    res="";
    var mx=Math.floor((n*n)/2);
    var arr=[];
    var flag=false;
    var pnum=1,cnt1=10,cnt2=10;

    const mineX = Math.floor(Math.random() * n);
    const mineY = Math.floor(Math.random() * n);
    console.log(mineX+1);  
    console.log(mineY+1);

    console.log();
    let player1 = prompt('Enter Player1 name: ');
    let player2 = prompt('Enter Player2 name: ');
    console.log();
    players= player1+ ' VS ' +player2;

    for(let i=0; i<n; i++)
    {
        arr[i]=[];
        for(let j=0; j<n; j++)
        {
            arr[i][j]='?';
        }
    }

    printBoard(arr);

    while(!flag)
    {
        if(pnum==1) console.log(`\n${player1}'s move:`);
        else if(pnum==2) console.log(`\n${player2}'s move:`);
        let coordinates = prompt('Enter coordinates of tile to open: ');

        var t=coordinates.split(' ');
        if(t.length<2) 
        {
            console.log('!Invalid coordinates.');
            continue;
        }
        x=t[0];   y=t[1];
        if(x=='e' || y=='e') return;

        x--;   y--;

        if(x>=n || y>=n || x<0 || y<0) 
        {
            console.log('!Invalid coordinates.');
            continue;
        }

        if(arr[x][y]!='?') 
        {
            console.log('Tile is already opened. Choose a different one.');
            continue;
        }
        
        if(x==mineX && y==mineY)
        {
            console.log();
            if(pnum==1) console.log(`${player1} opened a mine. ${player2} wins!`);
            else if(pnum==2) console.log(`${player2} opened a mine. ${player1} wins!`);
            flag = true;
            
            if(pnum==1)  res= player2 + ' wins.';
            else if(pnum==2)  res= player1 + ' wins.';

            arr[x][y] = 'M';

            s+='(';
            for(let i=0; i<5; i++)
            {
                for(let j=0; j<5; j++) s+=arr[i][j];
                s+=',';
            }
            s+=')';

            for(let i=0; i<n; i++)
            {
                for(let j=0; j<n; j++)   arr[i][j]='G';
            }
            arr[x][y] = 'M';
            console.log("Actual Board:")
            actualB+='[';
            for(let i=0; i<n; i++)
            {
                console.log(arr[i].join(' | '));
                for(let j=0; j<5; j++) actualB+=arr[i][j];
                actualB+=',';
            }
            actualB+=']';
            console.log("\n---------- GAME OVER ----------");
            addToTable(arr);
            break;
        }

        if (pnum == 1)    cnt1++;
        else              cnt2++;

        arr[x][y] = 'G'; 
        printBoard(arr);

        if (cnt1 >= mx && cnt2 >= mx) {
            console.log(`\nBoth players opened ${mx} tiles each. It's a draw!`);
            res= 'Draw';
            s+='(';
            for(let i=0; i<5; i++)
            {
                for(let j=0; j<5; j++) s+=arr[i][j];
                s+=',';
            }
            s+=')';

            for(let i=0; i<n; i++)
            {
                for(let j=0; j<n; j++)   arr[i][j]='G';
            }
            arr[mineX][mineY] = 'M';

            console.log("Actual Board:")
            actualB+='[';
            for(let i=0; i<n; i++)
            {
                console.log(arr[i].join(' | '));
                for(let j=0; j<5; j++) actualB+=arr[i][j];
                actualB+=',';
            }
            actualB+=']';
            console.log("\n---------- GAME OVER ----------");
            addToTable(arr);
            flag = true;
            break;
        }

        pnum = pnum == 1 ? 2 : 1;
        
    }
}

function viewHistory(){
    
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");



        con.end((error) => {
            if (error) {
                console.error('Error! closing MySQL connection:', error);
                return;
            }
        });
    });    
}

function resetGame(){

}


console.log("---------- MINES ----------")

while(1)
{ 
    console.log()
    console.log("1. Play Game.")
    console.log("2. View history.")
    console.log("3. Reset Game.")
    console.log("4. Exit Game.")

    let choice = prompt('Choose an option : ');

    if(choice==1) playGame();
    else if(choice==2) viewHistory();
    else if(choice==3) resetGame();
    else if(choice==4) break;
    else  break;;


}
return;
