function list_child_processes(){
    local ppid=$1;
    local current_children=$(pgrep -P $ppid);
    local local_child;
    if [ $? -eq 0 ];
    then
        for current_child in $current_children
        do
          local_child=$current_child;
          list_child_processes $local_child;
          echo $local_child;
        done;
    else
      return 0;
    fi;
}

ps 21270;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 21270 > /dev/null;
done;

for child in $(list_child_processes 21272);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/vladimirtrofimyuk/TRASH/core-angular-autocomplete/bin/Debug/net6.0/f5996d3afa2f4c6686c3b2966a3aafa3.sh;
