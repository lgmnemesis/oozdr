#!/bin/sh

export dist="www/"
export sitemapFile='./sitemap.txt'
export robotsFile='./robots.txt'

echo "Copying $sitemapFile file to $dist"
cp -rf $sitemapFile $dist

echo "Copying $robotsFile file to $dist"
cp -rf $robotsFile $dist