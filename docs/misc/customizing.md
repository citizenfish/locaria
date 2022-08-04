# Customizing

Once you have a working installation of locaria the next thing you want to do is make it your own through customization.
This is achieved with the use of themes. Locus comes with a 'default' theme that is currently setup to give you a
helping hand but you will want to change at least a few key things.

Before we start we suggest that you fork our repo before customising, that way you can keep upto date with security
updates and new features by merging in the base fork but also commit your local updates to your own repo. All themes are
stored in their own directory so if you don't want to do this just edit the files in place and make sure to keep a
backup.

Themes are stored in the directory:

`src/theme`

If you take a look we give you two examples 'default' and 'dark'.

You can switch theme by editing your config file:

####locaria.json
```json

{
	"new":
	{
      "profile":"locus",
      "theme":"default",
      "themeDir": "./src/theme/"
	}
}
```

Changing the 'theme' will change the theme we build base on the path, so if we change theme to 'dark' the
'./src/theme/dark/locaria.js' that will built.

To build a theme simply run for the terminal:

```shell
npm
run
build:new
```

You can then check your new site locally by running

```javascript
npm
run
runLocalSite
```

Vist the url http://127.0.0.1:8080 and you should see your now themed site looking dark.

You will now want to create your own theme to setup the site to look how you want. To do this, create a new directory
under src/theme in this example lets do 'myTheme'.

Adjust your webpack.config.js again to resolve to your new directory
#####locaria.json

```json
{
	"new":
	{
      "profile":"locus",
      "theme":"myTheme",
      "themeDir": "./src/theme/"
	}
}
```

Now copy the file locaria.js from the 'dark' theme directory into your myTheme. You can use the default one but to do
that you would need to copy all the images etc which is something you may do down the road but for now we will use all
the default images.

Now lets make some basic changes, at the bottom of the file you will find the configs structure

```javascript
const configs = {
	mapXYZ: 'https://api.os.uk/maps/raster/v1/zxy/Road_3857/{z}/{x}/{y}.png?key=w69znUGxB6IW5FXkFMH5LQovdZxZP7jv',
	mapAttribution: "© Crown copyright and database rights 2021 OS 123456",
	mapBuffer: 50000,
	cluster: true, // true|false
	clusterCutOff: 1.5,
	clusterWidthMod: 50,
	siteTitle: "Locaria - My council",
	homeGrid: 3,
	homeCategorySearch: ["Planning", "Events", "Crime"],
	defaultZoom: 12,
	defaultPostcode: "E1",
	defaultLocation: [5176.36, 6712961.88], // EPSG:3857
	defaultDistanceSelect: 'km', // km|mile
	defaultDistance: 10, // km|mile
	defaultMapIcon: iconDefault,
	searchIcon: iconPlanning,
	navShowHome: true

}

```

A simple test is to change siteTitle, run the rebuild process and then check your site.

Other simple changes such as colors can be done here:

```javascript
const theme = createTheme({
	palette: {
		primary: {
			main: '#0e3b16',
		},
		secondary: {
			main: '#238328',
		},
	},
});
```

You can also edit what channels you wish to display and adjust various other features all in here. When you are happy
with your new theme simply deploy 'web' using the described install process
in [Getting Started](getting_started.md)
