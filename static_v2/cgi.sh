#!/bin/bash


if [ -z "$QUERY_STRING" ]; then
	echo 'Content-type: text/plain'
	echo
	echo "Usage: run.sh?probe=[3456]&time=[utc_time]"
	exit 
fi

# Save the old internal field seperator
OIFS="$IFS"

# Set the field seperator to & and parse the QUERY_STRING at the ampersand
IFS="${IFS}&"
set $QUERY_STRING
Args="$*"
IFS="$OIFS"

# Next parse the individual "name=value" tokens

for i in $Args ;do
# Set the field seperator to = 
#IFS="${OIFS}="
#set $i
#IFS="${OIFS}"
	[ `echo $i | grep '^probe='` ] && probe=`echo $i | cut -f2 -d'='`
	[ `echo $i | grep '^time='` ] && time=`echo $i | cut -f2 -d'='`
	[ `echo $i | grep '^gran='` ] && gran=`echo $i | cut -f2 -d'='`
done

ip=`/sbin/ifconfig eth0 | grep 'inet addr' | cut -f2 -d':' | cut -f1 -d' '`
user="administrator"
pass="netscout1"
ifn=$probe
start=$time
delta=1

end=`expr $start + $delta`

/opt/NetScout/rtm/tools/exportcli -v -1:-1:-1:-1 -s 64 -pcap -s $ip -u $user -p $pass /opt/datamole/input.$$ $ip $ifn $start $end >/dev/null 2>/dev/null

if [ -e /opt/datamole/input.$$.pcap ]; then
	export LD_LIBRARY_PATH=/opt/datamole
	sed "s#PID#$$#" /opt/datamole/interfaces.xml_ > /opt/datamole/interfaces.xml
	sed "s#PID#$$#" /opt/datamole/outputs.xml_ > /opt/datamole/outputs.xml
	sed "s#GRAN#$$#" /opt/datamole/outputs.xml_ > /opt/datamole/outputs.xml
	/opt/datamole/datamole -c /opt/datamole ngenius >/dev/null 2>/dev/null
	[ -e /opt/datamole/output.$$.txt ] && mv -f /opt/datamole/output.$$.txt /var/www/thttpd/html/static/output.txt
	rm -f /opt/datamole/input.$$.pcap
fi

echo 'Content-type: text/plain'
echo
echo 'Success!'
echo
