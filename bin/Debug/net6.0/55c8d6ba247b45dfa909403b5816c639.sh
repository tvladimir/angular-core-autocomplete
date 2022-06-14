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

ps 8002;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 8002 > /dev/null;
done;

for child in $(list_child_processes 8140);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/vladimirtrofimyuk/TRASH/core-angular-autocomplete/bin/Debug/net6.0/55c8d6ba247b45dfa909403b5816c639.sh;
