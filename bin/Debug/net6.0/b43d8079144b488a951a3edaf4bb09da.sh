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

ps 46268;
while [ $? -eq 0 ];
do
  sleep 1;
  ps 46268 > /dev/null;
done;

for child in $(list_child_processes 46298);
do
  echo killing $child;
  kill -s KILL $child;
done;
rm /Users/vladimirtrofimyuk/TRASH2/angular-core-autocomplete/bin/Debug/net6.0/b43d8079144b488a951a3edaf4bb09da.sh;
