var n=5;
var mx=Math.floor((n*n)/2);
var arr=[];
var flag=false;
var pnum=2,cnt1=0,cnt2=0;
const prompt = require('prompt-sync')();

const mineX = Math.floor(Math.random() * n);
const mineY = Math.floor(Math.random() * n);
console.log(mineX+1);
console.log(mineY+1);

for(let i=0; i<n; i++)
{
    arr[i]=[];
    for(let j=0; j<n; j++)
    {
        arr[i][j]='?';
    }
}

function printBoard(ar) {
    console.log("Board State:")
    for(let i=0; i<n; i++)
    {
        console.log(ar[i].join(' | '));
        //console.log(ar[i]);
    }
}
printBoard(arr);


while(!flag)
{
    console.log();
    console.log('Player '+pnum+ ' move:');
    let x = prompt('Enter X coordinate of tile to open: ');
    let y = prompt('Enter Y coordinate of tile to open: ');

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
        console.log(`Player ${pnum} opened a mine. Player ${pnum === 1 ? 2 : 1} wins!`);
        flag = true;
        arr[x][y] = 'M'; // 'O' represents opened tile
        printBoard(arr);
        break;
    }

    if (pnum == 1)    cnt1++;
    else              cnt2++;

    arr[x][y] = 'G'; // 'O' represents opened tile
    printBoard(arr);

    if (cnt1 >= mx && cnt2 >= mx) {
        console.log(`Both players opened ${mx} tiles each. It's a draw!`);
        arr[mineX][mineY] = 'M';
        printBoard(arr);
        flag = true;
        break;
    }

    pnum = pnum == 1 ? 2 : 1;
    
}


