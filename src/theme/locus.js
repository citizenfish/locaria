import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
		"button": {
			background: "green"
		}
	})
);

const channels = [
	{"type":"Category","key":"chanPlanning","description":"Planning","category":"Planning"},
	{"type":"Category","key":"chanAll","description":"All","category":"*"},
	{"type":"Report","key":"chanDemocracy","description":"Democracy","report_name":"democracy_location"}
];

export  { useStyles, channels};
